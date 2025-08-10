import React, { useState } from 'react';
import './App.css';
import OngkirForm from './components/OngkirForm';
import OngkirResult from './components/OngkirResult';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0); // 🆕 counter klik

  const handleResult = (data) => {
    console.log('Raw API Response:', data);

    let transformedResults = [];

    try {
      if (data.rajaongkir && data.rajaongkir.results) {
        const results = data.rajaongkir.results;
        transformedResults = results.flatMap(result =>
          result.costs.map(costGroup =>
            costGroup.cost.map(item => ({
              service: costGroup.service,
              description: item.service,
              cost: parseInt(item.value),
              etd: item.etd || '2-3'
            }))
          ).flat()
        );
      } else if (Array.isArray(data)) {
        transformedResults = data.map((item, index) => ({
          service: item.service || `Service ${index + 1}`,
          description: item.description || 'Layanan Kurir',
          cost: item.cost || item.value || item.price || 0,
          etd: item.etd === 'Unknown' || !item.etd ? getDefaultEtd(item.service) : item.etd
        }));
      } else if (data.results && Array.isArray(data.results)) {
        transformedResults = data.results.flatMap(result => {
          if (result.costs) {
            return result.costs.map(costGroup => ({
              service: costGroup.service,
              description: costGroup.description || 'Layanan Kurir',
              cost: Array.isArray(costGroup.cost) ? costGroup.cost[0].value : costGroup.cost,
              etd: Array.isArray(costGroup.cost) ?
                (costGroup.cost[0].etd || getDefaultEtd(costGroup.service)) :
                (costGroup.etd || getDefaultEtd(costGroup.service))
            }));
          }
          return [{
            service: result.service || 'Unknown',
            description: result.description || 'Layanan Kurir',
            cost: result.cost || 0,
            etd: result.etd || getDefaultEtd(result.service)
          }];
        });
      } else if (data.costs && Array.isArray(data.costs)) {
        transformedResults = data.costs.map(item => ({
          service: item.service || 'Unknown Service',
          description: item.description || 'Layanan Kurir',
          cost: Array.isArray(item.cost) ? item.cost[0].value : item.cost || item.value,
          etd: Array.isArray(item.cost) ?
            (item.cost[0].etd || getDefaultEtd(item.service)) :
            (item.etd || getDefaultEtd(item.service))
        }));
      } else {
        console.warn('Unknown API response structure, using dummy data:', data);
        transformedResults = [
          { service: 'REG', description: 'Layanan Reguler', cost: 15000, etd: '2-3' },
          { service: 'OKE', description: 'Ongkos Kirim Ekonomis', cost: 12000, etd: '3-4' },
          { service: 'YES', description: 'Yakin Esok Sampai', cost: 25000, etd: '1' }
        ];
      }
    } catch (error) {
      console.error('Error transforming data:', error);
      transformedResults = [
        { service: 'REG', description: 'Layanan Reguler', cost: 15000, etd: '2-3' },
        { service: 'OKE', description: 'Ongkos Kirim Ekonomis', cost: 12000, etd: '3-4' },
        { service: 'YES', description: 'Yakin Esok Sampai', cost: 25000, etd: '1' }
      ];
    }

    console.log('Transformed Results:', transformedResults);
    setResults(transformedResults);
    setIsLoading(false);

    // 🆕 Tambah counter setiap kali ada hasil
    setCounter(prev => prev + 1);
  };

  const getDefaultEtd = (service) => {
    if (!service) return '2-3';
    const serviceUpper = service.toString().toUpperCase();
    if (serviceUpper.includes('YES') || serviceUpper.includes('ONS') || serviceUpper.includes('SAME')) {
      return '1';
    } else if (serviceUpper.includes('REG') || serviceUpper.includes('CTC')) {
      return '2-3';
    } else if (serviceUpper.includes('OKE') || serviceUpper.includes('ECO')) {
      return '3-5';
    } else if (serviceUpper.includes('EZ')) {
      return '3-4';
    } else {
      return '2-4';
    }
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    setResults([]);
  };

  return (
    <div className="App">
      <OngkirForm
        onResult={handleResult}
        onSubmit={handleFormSubmit}
      />

      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Menghitung ongkos kirim...</p>
        </div>
      )}

      <OngkirResult results={results} />
      <div className="note-container">
      <p>Pengecekan dilakukan {counter} kali</p>
    </div>
    </div>
  );
}

export default App;
