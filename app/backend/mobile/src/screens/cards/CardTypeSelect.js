import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CardTypeSelect({ navigation, route }) {
  const { card_type } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Card Format</Text>
      <Text style={styles.subtitle}>
        {card_type.toUpperCase()} CARD
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("CardDetailsForm", {
            card_type,
            card_format: "virtual",
          })
        }
      >
        <Text style={styles.btnText}>Virtual Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("CardDetailsForm", {
            card_type,
            card_format: "physical",
          })
        }
      >
        <Text style={styles.btnText}>Physical Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 10, fontWeight: "700" },
  subtitle: { color: "#888", fontSize: 16, marginBottom: 20 },
  btn: {
    backgroundColor: "#1E88E5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
