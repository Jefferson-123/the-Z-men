import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/client';

export default function TopUpScreen({ navigation }) {
  const [amount, setAmount] = useState('');

  async function handleTopUp() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return Alert.alert('Enter a valid amount');
    try {
      const res = await api.post('/wallet/topup', { amount: val });
      Alert.alert('Top-up successful', `New balance: ${res.data.balance} ZMW`);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Top up (development faucet)</Text>
      <TextInput
        placeholder="Amount (e.g., 50.00)"
        value={amount}
        keyboardType="decimal-pad"
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 10, marginVertical: 20, borderRadius: 6 }}
      />
      <Button title="Top up" onPress={handleTopUp} />
    </View>
  );
}
