const chatService = {
  searchUsers: async (query) => {
    // Return empty array or mock results; replace with real API call
    console.log('searchUsers', query);
    return [];
  },

  getMessages: async (userId, receiverId) => {
    console.log('getMessages', { userId, receiverId });
    return [];
  },

  sendMessage: async (senderId, receiverId, message) => {
    console.log('sendMessage', { senderId, receiverId, message });
    return { success: true };
  },
};

export default chatService;
