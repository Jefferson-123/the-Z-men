// screens/bank/TransferFundsDetails.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function TransferFundsDetails({ navigation, route }) {
  const { from, destination, bank } = route.params;

  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [reason, setReason] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Details</Text>

      {destination === "kalmpay" && (
        <TextInput
          placeholder="Kalmpay Username or Phone"
          style={styles.input}
          value={account}
          onChangeText={setAccount}
        />
      )}

      {destination === "bank" && (
        <>
          <Text style={styles.label}>Bank: {bank.name}</Text>
          <TextInput
            placeholder="Bank Account Number"
            style={styles.input}
            value={account}
            onChangeText={setAccount}
          />
        </>
      )}

      {destination === "institution" && (
        <TextInput
          placeholder="Institution Account / ID"
          style={styles.input}
          value={account}
          onChangeText={setAccount}
        />
      )}

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Description (Optional)"
        style={styles.input}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("TransferFundsConfirm", {
            from,
            destination,
            bank,
            amount,
            account,
            reason,
          })
        }
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 15, fontWeight: "700" },
  label: { fontSize: 18, marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
