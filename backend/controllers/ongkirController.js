require('dotenv').config();
const ongkirService = require('../services/rajaongkir');



exports.getProvinces = async (req, res) => {
  try {
    const provinces = await ongkirService.fetchProvinces();
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data provinsi' });
  }
};

exports.getCities = async (req, res) => {
  const { provinceId } = req.params;
  try {
    const cities = await ongkirService.fetchCities(provinceId);
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data kota' });
  }
};

exports.getCost = async (req, res) => {
  const { origin, destination, weight, courier } = req.body;

  // Validasi data masuk
  if (!origin || !destination || !weight || !courier) {
    return res.status(400).json({ error: 'Semua field (origin, destination, weight, courier) wajib diisi.' });
  }

  try {
    console.log('Request payload:', { origin, destination, weight, courier });

    const result = await ongkirService.calculateShippingCost(origin, destination, weight, courier);
    res.json(result);
    
  } catch (error) {
    console.error('Response error:', error.response?.data || error.message);
    console.error('Gagal menghitung ongkir:', error.message);
    return res.status(500).json({ message: 'Gagal menghitung ongkir', error: error.message });
  }
};
