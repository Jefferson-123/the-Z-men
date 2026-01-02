// services/bankService.js
export default {
  withdrawToBank: async (data) => {
    console.log("Sending withdrawal:", data);
    return true;
  },
  transferFunds: async (data) => {
    console.log("Transferring funds:", data);

    // YOUR API POST REQUEST HERE
    // return fetch("https://your-api.com/withdraw", { method: "POST", body: JSON.stringify(data) })

    return true;
  },
};
