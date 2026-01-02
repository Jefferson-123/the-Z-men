// screens/bank/TransferFundsConfirm.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import bankService from "../../services/bankService";

export default function TransferFundsConfirm({ navigation, route }) {
  const { from, destination, bank, amount, account, reason } = route.params;

  const onSend = async () => {
    await bankService.transferFunds({
      from,
      destination,
      bank: bank ? bank.name : null,
      account,
      amount,
      reason,
    });

    navigation.navigate("SuccessScreen", {
      message: "Transfer Completed Successfully",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Transfer</Text>

      <Text style={styles.text}>From: {from}</Text>
      <Text style={styles.text}>To: {destination}</Text>
      {bank && <Text style={styles.text}>Bank: {bank.name}</Text>}
      <Text style={styles.text}>Account: {account}</Text>
      <Text style={styles.text}>Amount: ZMW {amount}</Text>
      {reason ? <Text style={styles.text}>Reason: {reason}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={onSend}>
        <Text style={styles.btnText}>Confirm & Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "700" },
  text: { fontSize: 18, marginVertical: 4 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: { fontSize: 18, color: "#fff", textAlign: "center" },
});
