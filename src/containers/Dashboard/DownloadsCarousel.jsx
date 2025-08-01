import React, { useState, useEffect } from 'react';
import './DownloadsComponent.scss';

const DownloadsComponent = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('A1');

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        
        // Filtrar niveles con portada y solo A1, B1, C1
        const filteredLevels = data.filter(level => 
          level.portada && ['A1', 'B1', 'C1'].includes(level.nombre)
        );
        
        setLevels(filteredLevels);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const activeLevel = levels.find(level => level.nombre === activeTab);

  return (
    <div className="downloads-container">
      <h2>Niveles EMI</h2>
      
      <div className="tabs">
        {levels.map(level => (
          <button
            key={level.id}
            className={`tab-button ${activeTab === level.nombre ? 'active' : ''}`}
            onClick={() => setActiveTab(level.nombre)}
            style={{ borderBottomColor: level.color }}
          >
            {level.nombre}
          </button>
        ))}
      </div>
      
      {activeLevel && (
        <div className="level-card">
          <div className="level-thumbnail">
            <img src={activeLevel.portada} alt={`Portada ${activeLevel.nombre}`} />
          </div>
          
          <div className="level-info">
            <h3>{activeLevel.nombre_completo}</h3>
            
            <div className="level-details">
              <div className="institution">
                <span>Institución: </span>
                <span>{activeLevel.raiz.nombre_completo.split('»')[0].trim()}</span>
              </div>
              
              <div className="status">
                <span>Estado: </span>
                <span>{activeLevel.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
            
            <button className="download-button">
              Descargar Material
            </button>
            
            <div className="requirements">
              <span>Requisitos para aprobar: 80%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadsComponent;