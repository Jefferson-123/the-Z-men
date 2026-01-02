import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import chatService from "../../services/chatService";

export default function ChatSearch({ navigation }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const searchUsers = async () => {
    const res = await chatService.searchUsers(search);
    setResults(res);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search user/company..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.searchBtn} onPress={searchUsers}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate("ChatRoom", {
                receiver: item,
              })
            }
          >
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.full_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  search: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  searchBtn: {
    marginVertical: 10,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 10,
  },
  searchBtnText: { textAlign: "center", fontSize: 18, color: "#fff" },
  userItem: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    marginBottom: 10,
  },
  username: { fontSize: 18, fontWeight: "700" },
});
