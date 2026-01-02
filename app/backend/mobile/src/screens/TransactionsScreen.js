import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../api/client';

export default function TransactionsScreen() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTxs() {
    setLoading(true);
    try {
      const res = await api.get('/wallet/transactions?limit=50');
      setTxs(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTxs(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={txs}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.type} — {item.amount} {item.currency}</Text>
            <Text style={{ fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={{ fontSize: 12 }}>{JSON.stringify(item.metadata)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No transactions yet</Text>}
      />
    </View>
  );
}
