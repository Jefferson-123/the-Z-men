// screens/bank/WithdrawSourceScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const banks = [
  { id: 1, name: "Zanaco Bank" },
  { id: 2, name: "ABSA Bank" },
  { id: 3, name: "Stanbic Bank" },
  { id: 4, name: "FNB Bank" },
];

export default function WithdrawSourceScreen({ route, navigation }) {
  const { source } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select Destination Bank ({source === "wallet" ? "From Wallet" : "From Bank"})
      </Text>

      {banks.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={styles.bankBtn}
          onPress={() =>
            navigation.navigate("WithdrawSelectBank", {
              source,
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "700" },
  bankBtn: {
    backgroundColor: "#e8e8e8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bankText: { fontSize: 18 },
});
