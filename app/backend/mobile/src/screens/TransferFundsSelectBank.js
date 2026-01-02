// screens/bank/TransferFundsSelectBank.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const banks = [
  { id: 1, name: "Zanaco Bank" },
  { id: 2, name: "ABSA Bank" },
  { id: 3, name: "Stanbic Bank" },
  { id: 4, name: "FNB Bank" },
];

export default function TransferFundsSelectBank({ navigation, route }) {
  const { from, destination } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Bank</Text>

      {banks.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={styles.bankBtn}
          onPress={() =>
            navigation.navigate("TransferFundsDetails", {
              from,
              destination,
              bank,
            })
          }
        >
          <Text style={styles.bankText}>{bank.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  bankBtn: {
    backgroundColor: "#e8e8e8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bankText: { fontSize: 18 },
});
