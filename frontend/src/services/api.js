import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log('API BASE URL:', process.env.REACT_APP_API_BASE_URL);


export const fetchProvinces = () => axios.get(`${API_BASE_URL}/api/provinces`);
export const fetchCities = (provinceId) => axios.get(`${API_BASE_URL}/api/cities/${provinceId}`);
export const calculateOngkir = (data) => axios.post(`${API_BASE_URL}/api/cost`, data);
