import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function ChatScreen({ route }) {
  const { otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = "USER_ID_123"; // replace with logged-in user

  // Load chat history
  const loadMessages = async () => {
    let { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser})`
      )
      .order("created_at", { ascending: true });

    if (!error) setMessages(data);
  };

  // Real-time updates
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;

          if (
            (newMsg.sender_id === currentUser &&
              newMsg.receiver_id === otherUser.id) ||
            (newMsg.sender_id === otherUser.id &&
              newMsg.receiver_id === currentUser)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser,
        receiver_id: otherUser.id,
        message: text,
      },
    ]);

    if (!error) setText("");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender_id === currentUser
          ? styles.myMessage
          : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {otherUser.full_name}</Text>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      {/* Input area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A2647" },
  header: {
    padding: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    borderBottomWidth: 1,
    borderColor: "#144272",
  },
  chatList: { padding: 15 },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: "#144272",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#205295",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#144272",
    backgroundColor: "#082032",
  },
  input: {
    flex: 1,
    backgroundColor: "#1E3A5F",
    padding: 10,
    borderRadius: 10,
    color: "white",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#205295",
    padding: 12,
    borderRadius: 10,
  },
  sendText: { color: "white", fontWeight: "bold" },
});
