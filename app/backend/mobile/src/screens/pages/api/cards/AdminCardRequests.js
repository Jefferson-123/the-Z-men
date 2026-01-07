import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";

export default function AdminCardRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    let { data } = await supabase
      .from("card_requests")
      .select(`*, users(full_name, email)`)
      .eq("status", "pending");

    setRequests(data);
  };

  const approve = async (id) => {
    await fetch("/api/cards/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, adminId: "ADMIN_ID_123" })
    });
    loadRequests();
  };

  const reject = async (id) => {
    await fetch("/api/cards/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, adminId: "ADMIN_ID_123" })
    });
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Card Requests</Text>

      {requests.map((req) => (
        <View style={styles.box} key={req.id}>
          <Text style={styles.text}>
            {req.users.full_name} - {req.card_type} ({req.card_form})
          </Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.approve} onPress={() => approve(req.id)}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reject} onPress={() => reject(req.id)}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#0A2647", flex: 1 },
  title: { color: "white", fontSize: 24, marginBottom: 20 },
  box: {
    backgroundColor: "#144272",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  text: { color: "white", fontSize: 16 },
  row: { flexDirection: "row", marginTop: 10 },
  approve: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  reject: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
});
