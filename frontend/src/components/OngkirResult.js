// src/components/OngkirResult.js
import React from 'react';

const OngkirResult = ({ results }) => {
  console.log('Results data:', results); // Debug log untuk melihat struktur data
  
  if (!results || results.length === 0) return null;

  const formatCurrency = (cost) => {
    // Handle berbagai kemungkinan format cost
    if (!cost && cost !== 0) return 'N/A';
    
    // Jika cost adalah object dengan property value
    if (typeof cost === 'object' && cost.value) {
      return parseInt(cost.value).toLocaleString('id-ID');
    }
    
    // Jika cost adalah array (dari RajaOngkir API)
    if (Array.isArray(cost) && cost.length > 0) {
      return parseInt(cost[0].value).toLocaleString('id-ID');
    }
    
    // Jika cost adalah string atau number
    const numericCost = parseInt(cost);
    if (isNaN(numericCost)) return 'N/A';
    
    return numericCost.toLocaleString('id-ID');
  };

  const formatEtd = (etd) => {
    console.log('ETD value received:', etd); // Debug log untuk ETD
    
    // Jika etd adalah "Unknown" atau kosong, return default
    if (!etd || etd === 'Unknown' || etd === 'unknown' || etd === '') {
      return '1-2 hari'; // Default value
    }
    
    // Jika etd sudah berisi 'hari', tampilkan langsung
    if (typeof etd === 'string' && etd.toLowerCase().includes('hari')) {
      return etd;
    }
    
    // Jika etd adalah angka atau string angka
    if (!isNaN(etd) && etd !== '') {
      return `${etd} hari`;
    }
    
    // Jika etd berformat "2-3" atau "1-3"
    if (typeof etd === 'string' && etd.match(/^\d+(-\d+)?$/)) {
      return `${etd} hari`;
    }
    
    // Default fallback
    return `${etd} hari`;
  };

  const getServiceName = (service, description) => {
    if (!service && !description) return 'Unknown Service';
    
    if (service && description) {
      return `${service} (${description})`;
    }
    
    return service || description || 'Unknown Service';
  };

  return (
    <div className="result-table">
      <h3>Hasil Cek Ongkir</h3>
      <table>
        <thead>
          <tr>
            <th>Layanan</th>
            <th>Tarif (Rp)</th>
            <th>Estimasi (hari)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => {
            console.log(`Item ${index}:`, item); // Debug log untuk setiap item
            
            return (
              <tr key={index}>
                <td>{getServiceName(item.service, item.description)}</td>
                <td>{formatCurrency(item.cost)}</td>
                <td>{formatEtd(item.etd)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OngkirResult;