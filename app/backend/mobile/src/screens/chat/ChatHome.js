import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ChatHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("ChatSearch")}
      >
        <Text style={styles.btnText}>Search Users / Companies</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
