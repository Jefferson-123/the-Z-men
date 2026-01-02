import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import cardService from "../../services/cardService";

export default function CardRequestStatus() {
  const user_id = "CURRENT_USER_ID";
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const data = await cardService.getRequests(user_id);
    setRequests(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Card Requests</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.main}>
              {item.card_type.toUpperCase()} ({item.card_format})
            </Text>
            <Text>Status: {item.status}</Text>
            <Text>Requested: {item.created_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 20, fontWeight: "700" },
  item: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  main: { fontSize: 18, fontWeight: "700" },
});
