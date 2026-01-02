import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    if (!amount) return alert("Enter amount");

    try {
      // API call for withdraw
      // await fetch("https://your-api.com/withdraw", {...})

      alert("Withdrawal Successful!");
    } catch (error) {
      alert("Withdraw failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>

      <TextInput
        placeholder="Enter amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
