// returns provider instance given bank_code or region
const MockBankProvider = require('./providers/mockBankProvider');

function getProviderForBank(bankCodeOrRegion) {
  // Simple mapping: if bank code starts with "MOCK", return mock provider
  // In production map bank_code -> provider implementation class
  return new MockBankProvider();
}

module.exports = { getProviderForBank };
