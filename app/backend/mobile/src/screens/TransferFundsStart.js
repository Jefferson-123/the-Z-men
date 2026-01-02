// screens/bank/TransferFundsStart.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TransferFundsStart({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Funds To Bank</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("TransferFundsDestination", { from: "wallet" })
        }
      >
        <Text style={styles.btnText}>From Kalmpay Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("TransferFundsDestination", { from: "bank" })
        }
      >
        <Text style={styles.btnText}>From Another Bank/Institution</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 25 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btnText: { fontSize: 18, color: "#fff", textAlign: "center" },
});
