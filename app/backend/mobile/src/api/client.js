import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE = 'http://10.0.2.2:4000'; // adjust for emulator / device

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

// attach token if present
instance.interceptors.request.use(async (cfg) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default instance;
