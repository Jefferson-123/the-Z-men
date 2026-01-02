import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/client';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function handleRegister() {
    if (!phone) return Alert.alert('Phone required');
    try {
      const res = await api.post('/auth/register', { phone, name });
      if (res.data && res.data.otpSent) {
        // We need the user id — backend stored user, so query to fetch user id by phone
        // Simpler: backend could return userId. For now, call a small lookup
        // But our backend returns nothing; we will fetch user by phone endpoint? To avoid extra endpoints, change backend to return userId on register.
        // For this client, assume backend returns userId in res.data.userId
        const userId = res.data.userId;
        navigation.navigate('VerifyOTP', { userId });
      } else {
        Alert.alert('OTP not sent', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Create account</Text>
      <TextInput placeholder="Full name (optional)" value={name} onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 }} />
      <TextInput placeholder="Phone (e.g. +2609...)" value={phone} onChangeText={setPhone}
        keyboardType="phone-pad" style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 }} />
      <Button title="Send OTP" onPress={handleRegister} />
    </View>
  );
}
