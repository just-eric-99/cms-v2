import axios from 'axios'
import { API_ENDPOINT } from '@/constants/network.ts'

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "https://skhwc-pain2.com/, http://localhost:5173/",
  },
})
