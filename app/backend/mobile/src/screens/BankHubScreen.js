
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function BankHubScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* WALLET BALANCE BOX */}
      <View style={styles.walletBox}>
        <Text style={styles.title}>KALMPAY WALLET</Text>
        <Text style={styles.balance}>ZMW 500</Text>
      </View>

      {/* MAIN BUTTONS */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("DepositScreen")}>
        <Text style={styles.buttonText}>Deposit from Bank</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("WithdrawScreen")}>
        <Text style={styles.buttonText}>Withdraw to Bank</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TransferFundsScreen")}>
        <Text style={styles.buttonText}>Transfer Funds to Bank</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ChatSearchScreen")}>
        <Text style={styles.buttonText}>Send Message / Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RequestCardScreen")}>
        <Text style={styles.buttonText}>Request Debit or Credit</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40
  },
  walletBox: {
    padding: 20,
    backgroundColor: '#0A2647',
    width: '90%',
    borderRadius: 12,
    marginBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  balance: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    width: '90%',
    paddingVertical: 18,
    backgroundColor: '#144272',
    borderRadius: 12,
    marginBottom: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  }
});
