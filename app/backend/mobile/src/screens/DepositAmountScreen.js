import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../supabase";

export default function DepositAmountScreen({ route, navigation }) {
  const { bank } = route.params;
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (!amount) return alert("Enter amount");

    // Save transaction in Supabase
    const { error } = await supabase.from("transactions").insert([
      {
        user_id: "USER_ID_HERE", // replace with actual logged in user
        type: "deposit_bank",
        amount: amount,
        metadata: { bank: bank.bank_name },
      },
    ]);

    if (error) {
      console.log(error);
      alert("Error saving transaction");
    } else {
      alert("Deposit Request Sent!");
      navigation.navigate("BankHubScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit from {bank.bank_name}</Text>

      <TextInput
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleDeposit}>
        <Text style={styles.buttonText}>Confirm Deposit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    padding: 15,
    backgroundColor: "#144272",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
