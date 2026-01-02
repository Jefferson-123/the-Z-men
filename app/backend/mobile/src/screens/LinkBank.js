import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api/client';

export default function LinkBank({ route, navigation }) {
  const bank = route.params?.bank;
  const [accountNumber, setAccountNumber] = useState('');

  async function handleLink() {
    if (!accountNumber) return Alert.alert('Enter account number');
    try {
      const res = await api.post('/banks/link', { bank_code: bank.code, bank_name: bank.name, account_number: accountNumber, country: bank.country || 'ZM' });
      const bankAccount = res.data.bankAccount;
      Alert.alert('Bank linked', `Account name: ${bankAccount.account_name}`);
      // Return to previous screen with bankAccountId
      navigation.navigate('DepositFromBank', { bankAccountId: bankAccount.id });
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  }

  return (
    <View style={{ padding:12 }}>
      <Text>Link {bank?.name}</Text>
      <TextInput placeholder="Account number" value={accountNumber} onChangeText={setAccountNumber} style={{ borderWidth:1, padding:10, marginVertical:12 }} />
      <Button title="Link account" onPress={handleLink} />
    </View>
  );
}
