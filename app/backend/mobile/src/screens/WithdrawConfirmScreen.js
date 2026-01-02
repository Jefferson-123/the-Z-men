// screens/bank/WithdrawConfirmScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import bankService from "../../services/bankService";

export default function WithdrawConfirmScreen({ route, navigation }) {
  const { source, bank, amount, account } = route.params;

  const handleWithdraw = async () => {
    await bankService.withdrawToBank({
      from: source,
      bank: bank.name,
      amount,
      accountNumber: account,
    });

    navigation.navigate("SuccessScreen", {
      message: "Withdrawal Request Sent Successfully",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Withdrawal</Text>

      <Text style={styles.label}>From: {source}</Text>
      <Text style={styles.label}>To Bank: {bank.name}</Text>
      <Text style={styles.label}>Account: {account}</Text>
      <Text style={styles.label}>Amount: ZMW {amount}</Text>

      <TouchableOpacity style={styles.btn} onPress={handleWithdraw}>
        <Text style={styles.btnText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 18, marginVertical: 5 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
