import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CardRequestHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Card</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("CardTypeSelect", { card_type: "debit" })
        }
      >
        <Text style={styles.btnText}>Request Debit Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("CardTypeSelect", { card_type: "credit" })
        }
      >
        <Text style={styles.btnText}>Request Credit Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statusBtn}
        onPress={() => navigation.navigate("CardRequestStatus")}
      >
        <Text style={styles.statusText}>View Your Requests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
  statusBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderColor: "#1E88E5",
    borderWidth: 2,
  },
  statusText: { color: "#1E88E5", textAlign: "center", fontSize: 16 },
});
