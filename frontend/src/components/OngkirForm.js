// src/components/OngkirForm.js
import React, { useEffect, useState } from 'react';
import { fetchProvinces, fetchCities, calculateOngkir } from '../services/api';

const OngkirForm = ({ onResult, onSubmit }) => {
  const [provinces, setProvinces] = useState([]);
  const [originProvince, setOriginProvince] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationProvince, setDestinationProvince] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [courier, setCourier] = useState('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProvinces().then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (originProvince) {
      fetchCities(originProvince).then((res) => setOriginCities(res.data));
      setOriginCity(''); // Reset city when province changes
    }
  }, [originProvince]);

  useEffect(() => {
    if (destinationProvince) {
      fetchCities(destinationProvince).then((res) => setDestinationCities(res.data));
      setDestinationCity(''); // Reset city when province changes
    }
  }, [destinationProvince]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!originCity || !destinationCity || !weight || !courier) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setIsLoading(true);
    if (onSubmit) onSubmit(); // Notify parent component

    const payload = {
      origin: originCity,
      destination: destinationCity,
      weight: parseInt(weight),
      courier: courier.toLowerCase()
    };

    try {
      const res = await calculateOngkir(payload);
      onResult(res.data);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.querySelector('.result-table');
        if (resultsElement) {
          resultsElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
      
    } catch (err) {
      console.error('Error calculating ongkir:', err);
      alert('Gagal menghitung ongkir. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`form-container ${isLoading ? 'loading' : ''}`}>
      <h2>Cek Ongkir</h2>
      <div className="row">
        {/* Kota Asal */}
        <div>
          <h4>Kota Asal</h4>

          {/* Provinsi Asal */}
          <label>Provinsi</label>
          <select 
            value={originProvince} 
            onChange={(e) => setOriginProvince(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((prov) => (
              <option key={`origin-prov-${prov.id}`} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>

          {/* Kota Asal */}
          <label>Kota</label>
          <select 
            value={originCity} 
            onChange={(e) => setOriginCity(e.target.value)}
            disabled={isLoading || !originProvince}
          >
            <option value="">Pilih Kota</option>
            {originCities.map((city) => (
              <option key={`origin-city-${city.id}`} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Kurir */}
          <label>Kurir</label>
          <select 
            value={courier} 
            onChange={(e) => setCourier(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Pilih Kurir</option>
            <option value="jne">JNE</option>
            <option value="jnt">J&T Express</option>
            <option value="pos">POS Indonesia</option>
          </select>
        </div>

        {/* Kota Tujuan */}
        <div>
          <h4>Kota Tujuan</h4>

          {/* Provinsi Tujuan */}
          <label>Provinsi</label>
          <select 
            value={destinationProvince} 
            onChange={(e) => setDestinationProvince(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((prov) => (
              <option key={`dest-prov-${prov.id}`} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>

          {/* Kota Tujuan */}
          <label>Kota</label>
          <select 
            value={destinationCity} 
            onChange={(e) => setDestinationCity(e.target.value)}
            disabled={isLoading || !destinationProvince}
          >
            <option value="">Pilih Kota</option>
            {destinationCities.map((city) => (
              <option key={`dest-city-${city.id}`} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Berat */}
          <label>Berat (gram)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            min="1"
            max="30000"
            placeholder="Masukkan berat dalam gram"
            disabled={isLoading}
            required 
          />

          {/* Tombol Submit */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Menghitung...' : 'Hitung Ongkir'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OngkirForm;