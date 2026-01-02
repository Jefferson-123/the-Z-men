import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/client';
import * as SecureStore from 'expo-secure-store';

export default function VerifyOTPScreen({ route, navigation }) {
  const { userId } = route.params;
  const [otp, setOtp] = useState('');

  async function handleVerify() {
    if (!otp) return Alert.alert('Enter OTP');
    try {
      const res = await api.post('/auth/verify-otp', { userId, otp });
      const token = res.data.token;
      if (!token) return Alert.alert('verify failed');
      await SecureStore.setItemAsync('token', token);
      Alert.alert('Welcome', 'Account created');
      navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Verify OTP</Text>
      <Text>We sent an OTP to your phone. Enter it below.</Text>
      <TextInput placeholder="123456" value={otp} onChangeText={setOtp} keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginVertical: 20, borderRadius: 6 }} />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}
