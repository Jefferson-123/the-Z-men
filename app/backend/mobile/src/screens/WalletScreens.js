import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import api from '../api/client';
import { useIsFocused } from '@react-navigation/native';

export default function WalletScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const isFocused = useIsFocused();

  async function fetchWallet() {
    setLoading(true);
    try {
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) fetchWallet();
  }, [isFocused]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Wallet</Text>
      <Text style={{ fontSize: 32, marginVertical: 20 }}>
        {wallet ? `${wallet.balance} ${wallet.currency}` : '—'}
      </Text>

      <Button title="Top up (dev faucet)" onPress={() => navigation.navigate('TopUp')} />
      <View style={{ height: 12 }} />
      <Button title="Send (internal)" onPress={() => navigation.navigate('Transfer')} />
      <View style={{ height: 12 }} />
      <Button title="Transactions" onPress={() => navigation.navigate('Transactions')} />
    </View>
  );
}
