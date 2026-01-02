import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function DepositScreen() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (!amount) return alert("Enter amount");

    try {
      // Send API request
      // await fetch("https://your-api.com/deposit", {...})

      alert("Deposit Successful!");
    } catch (error) {
      alert("Deposit failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>

      <TextInput
        placeholder="Enter amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleDeposit}>
        <Text style={styles.buttonText}>Deposit</Text>
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
    backgroundColor: "#00894C",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
