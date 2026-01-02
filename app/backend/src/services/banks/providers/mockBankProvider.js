// Simulates bank API calls synchronously for dev/test
class MockBankProvider {
  constructor() {
    // config, keys etc would be passed in real provider
  }

  // Simulate debit from user's bank account -> sending money to app's settlement account
  // returns { success: true, externalId, message }
  async debit({ bankAccount, amount, currency = 'ZMW', reference }) {
    console.log('MOCK debit', bankAccount, amount);
    // simulate small delay / random success
    return { success: true, externalId: `MOCK-DEBIT-${Date.now()}`, message: 'debited' };
  }

  // Simulate credit: app sends money to user's bank account
  async credit({ bankAccount, amount, currency = 'ZMW', reference }) {
    console.log('MOCK credit', bankAccount, amount);
    return { success: true, externalId: `MOCK-CREDIT-${Date.now()}`, message: 'credited' };
  }

  // optional: verify account details
  async verifyAccount({ accountNumber, bankCode, country }) {
    return { success: true, account_name: `Mock User ${accountNumber.slice(-4)}` };
  }

  // get list of banks by country / region
  static async listBanksByCountry(countryCode) {
    // return mock banks
    return [
      { code: `${countryCode}-MOCK-1`, name: `${countryCode} Mock Bank A` },
      { code: `${countryCode}-MOCK-2`, name: `${countryCode} Mock Bank B` },
    ];
  }
}

module.exports = MockBankProvider;
