require('dotenv').config();
const axios = require('axios');
const qs = require('qs');


// Ambil base URL dan API key dari .env
const BASE_URL = process.env.KOMERCE_BASE_URL;
const API_KEY = process.env.KOMERCE_API_KEY;

// Ambil daftar provinsi
exports.fetchProvinces = async () => {

  try {
    const response = await axios.get(`${BASE_URL}/destination/province`, {
      headers: {
        'Key': API_KEY
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Gagal mengambil data provinsi:', error.response?.data || error.message);
    return [];
  }
};

// Ambil daftar kota berdasarkan ID provinsi
exports.fetchCities = async (provinceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/destination/city/${provinceId}`, {
     headers: {
        'Key': API_KEY
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data kota:", error.response?.data || error.message);
     return [];
  }
};

// Hitung ongkir
exports.calculateShippingCost = async (origin, destination, weight, courier) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/calculate/district/domestic-cost`,
      qs.stringify({
        origin,
        destination,
        weight,
        courier
      }),
      {
        headers: {
          key: API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Gagal menghitung ongkir:', error.response?.data || error.message);
    throw new Error('Gagal menghitung ongkir');
  }
};