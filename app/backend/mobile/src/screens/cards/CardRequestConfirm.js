import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import cardService from "../../../services/cardService";

export default function CardRequestConfirm({ navigation, route }) {
  const { card_type, card_format, address } = route.params;
  const user_id = "CURRENT_USER_ID"; // replace with auth user id

  const sendRequest = async () => {
    await cardService.requestCard({
      user_id,
      card_type,
      card_format,
      delivery_address: card_format === "physical" ? address : null,
    });

    navigation.navigate("SuccessScreen", {
      message: "Card Request Sent Successfully!",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Request</Text>

      <Text style={styles.text}>Card Type: {card_type}</Text>
      <Text style={styles.text}>Format: {card_format}</Text>

      {card_format === "physical" && (
        <Text style={styles.text}>Address: {address}</Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={sendRequest}>
        <Text style={styles.btnText}>Confirm Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 20 },
  text: { fontSize: 18, marginVertical: 4 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
