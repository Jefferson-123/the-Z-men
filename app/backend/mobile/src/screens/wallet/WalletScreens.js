import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WalletScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalmpay Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>ZMW 1,250.00</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DepositScreen")}
        >
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WithdrawScreen")}
        >
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  balanceCard: {
    padding: 25,
    backgroundColor: "#1E88E5",
    borderRadius: 15,
    marginBottom: 30,
  },
  balanceLabel: { color: "#fff", fontSize: 16 },
  balance: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    backgroundColor: "#0A66C2",
    padding: 15,
    width: "48%",
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
