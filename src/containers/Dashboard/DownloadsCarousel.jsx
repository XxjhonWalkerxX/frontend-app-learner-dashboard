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
        if (!response.ok) throw new Error('Error al obtener los datos');
        
        const data = await response.json();
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

  const activeLevels = levels.filter(level => level.nombre === activeTab);
  const uniqueTabs = [...new Set(levels.map(level => level.nombre))];

  return (
    <div className="downloads-container">
      <h2>Niveles EMI</h2>
      
      <div className="tabs">
        {uniqueTabs.map(levelName => (
          <button
            key={levelName}
            className={`tab-button ${activeTab === levelName ? 'active' : ''}`}
            onClick={() => setActiveTab(levelName)}
          >
            {levelName}
          </button>
        ))}
      </div>
      
      <div className="levels-grid">
        {activeLevels.map((level) => (
          <div key={level.id} className="level-card">
            <div className="level-thumbnail">
              <img src={level.portada} alt={`Portada ${level.nombre}`} />
            </div>
            
            <div className="level-info">
              <h3>{level.nombre_completo}</h3>
              
              <div className="level-details">
                <div className="institution">
                  <span>Institución: </span>
                  <span>{level.raiz.nombre_completo.split('»')[0].trim()}</span>
                </div>
                
                <div className="status">
                  <span>Estado: </span>
                  <span>{level.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
              
              <button className="download-button">
                Descargar Material
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadsComponent;