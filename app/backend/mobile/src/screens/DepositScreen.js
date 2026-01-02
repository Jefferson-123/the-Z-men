import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { supabase } from "../supabase"; // your supabase client

export default function DepositScreen({ navigation }) {
  const [banks, setBanks] = useState([]);

  // Fetch banks from Supabase
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    const { data, error } = await supabase.from("banks").select("*");

    if (error) {
      console.log(error);
    } else {
      setBanks(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Bank</Text>

      <FlatList
        data={banks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bankItem}
            onPress={() =>
              navigation.navigate("DepositAmountScreen", { bank: item })
            }
          >
            <Text style={styles.bankName}>{item.bank_name}</Text>
            <Text style={styles.country}>{item.country}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bankItem: {
    padding: 15,
    backgroundColor: "#144272",
    marginVertical: 8,
    borderRadius: 10,
  },
  bankName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  country: {
    color: "#ddd",
    fontSize: 14,
  },
});
