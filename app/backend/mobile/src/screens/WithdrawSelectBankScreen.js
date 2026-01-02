// screens/bank/WithdrawSelectBankScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function WithdrawSelectBankScreen({ route, navigation }) {
  const { source, bank } = route.params;

  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw to {bank.name}</Text>

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Account Number"
        style={styles.input}
        value={account}
        onChangeText={setAccount}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("WithdrawConfirm", {
            source,
            bank,
            amount,
            account,
          })
        }
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
