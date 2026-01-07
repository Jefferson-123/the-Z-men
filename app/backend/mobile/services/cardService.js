const cardService = {
  getRequests: async (user_id) => {
    console.log('getRequests for', user_id);
    return [];
  },

  requestCard: async (payload) => {
    console.log('requestCard', payload);
    return { success: true };
  },
};

export default cardService;
