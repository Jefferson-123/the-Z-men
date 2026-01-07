import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import chatService from "../../../services/chatService";
import { supabase } from "../../lib/supabase";

export default function ChatRoom({ route }) {
  const { receiver } = route.params;
  const userId = "CURRENT_USER_ID_HERE"; // replace with your auth ID

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Load messages
  const loadMessages = async () => {
    const res = await chatService.getMessages(userId, receiver.id);
    setMessages(res);
  };

  useEffect(() => {
    loadMessages();

    // Real-time updates
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => loadMessages()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const send = async () => {
    await chatService.sendMessage(userId, receiver.id, message);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {receiver.username}</Text>

      <FlatList
        style={styles.messageList}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.sender_id === userId ? styles.me : styles.them,
            ]}
          >
            <Text style={styles.msgText}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.row}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  messageList: { flex: 1 },
  msg: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "70%",
  },
  me: {
    backgroundColor: "#1E88E5",
    alignSelf: "flex-end",
  },
  them: {
    backgroundColor: "#eaeaea",
    alignSelf: "flex-start",
  },
  msgText: { color: "#000" },
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  sendBtn: {
    backgroundColor: "#1E88E5",
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  sendText: { color: "#fff", fontWeight: "700" },
});
