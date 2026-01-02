// screens/bank/WithdrawToBankScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WithdrawToBankScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw To Bank</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("WithdrawSource", { source: "wallet" })
        }
      >
        <Text style={styles.btnText}>From Kalmpay Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("WithdrawSource", { source: "bank" })
        }
      >
        <Text style={styles.btnText}>From Another Bank / Institution</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 30 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
