import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function CardDetailsForm({ navigation, route }) {
  const { card_type, card_format } = route.params;
  const [address, setAddress] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Details</Text>

      {card_format === "physical" && (
        <TextInput
          placeholder="Delivery Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("CardRequestConfirm", {
            card_type,
            card_format,
            address,
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
  title: { fontSize: 26, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
