const bankService = {
  transferFunds: async (payload) => {
    // Placeholder implementation — replace with real API call
    console.log('transferFunds called with', payload);
    return { success: true };
  },

  withdrawToBank: async (payload) => {
    console.log('withdrawToBank called with', payload);
    return { success: true };
  },
};

export default bankService;
