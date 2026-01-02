import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import api from '../api/client';

export default function BankListPicker({ route, navigation }) {
  const country = route.params?.country || 'ZM';
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchBanks() {
    setLoading(true);
    try {
      const res = await api.get(`/banks/list?country=${country}`);
      setBanks(res.data.banks || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchBanks(); }, []);

  if (loading) return <ActivityIndicator style={{ flex:1 }} />;
  return (
    <View style={{ flex:1, padding:12 }}>
      <Text style={{ marginBottom:10 }}>Banks in {country}</Text>
      <FlatList
        data={banks}
        keyExtractor={b => b.code}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding:12, borderBottomWidth:1 }} onPress={() => navigation.navigate('LinkBank', { bank: item })}>
            <Text>{item.name}</Text>
            <Text style={{ fontSize:12 }}>{item.code}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
