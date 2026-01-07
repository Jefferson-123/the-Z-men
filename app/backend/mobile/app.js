import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import BankHubScreen from './src/screens/BankHubScreen';
import BankListPicker from './src/screens/BankListPicker';
import ChatScreen from './src/screens/chatScreen';
import ChatSearch from './src/screens/chatSearch';
import DepositAmountScreen from './src/screens/DepositAmountScreen';
import DepositScreen from './src/screens/DepositScreen';
import LinkBankScreen from './src/screens/LinkBankScreen';
import RequestCreditScreen from './src/screens/RequestCreditScreen';
import RequestDebtScreen from './src/screens/RequestDebtScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TopUpScreen from './src/screens/TopUpScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import TransferScreen from './src/screens/TransferScreen';
import VerifyOTPScreen from './src/screens/VerifyOTPScreen';
import WalletScreen from './src/screens/WalletScreens';
import WithdrawScreen from './src/screens/WithdrawScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BankHub" component={BankHubScreen} />
        <Stack.Screen name="BankListPicker" component={BankListPicker} />
        <Stack.Screen name="LinkBank" component={LinkBankScreen} />
        <Stack.Screen name="ChatSearch" component={ChatSearch} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="RequestDebt" component={RequestDebtScreen} />
        <Stack.Screen name="RequestCredit" component={RequestCreditScreen} />
        <Stack.Screen name="Withdraw" component={WithdrawScreen} />
        <Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="TopUp" component={TopUpScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="DepositScreen" component={DepositScreen} />
        <Stack.Screen name="WithdrawConfirmationScreen" component={WithdrawScreen} />
        <Stack.Screen name="DepositAmountScreen" component={DepositAmountScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="MainApp" component={() => null} options={{ title: 'Kalmpay' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});