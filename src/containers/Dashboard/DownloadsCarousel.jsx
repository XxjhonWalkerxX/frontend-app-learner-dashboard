import React, { useState, useEffect } from 'react';
import './DownloadsComponent.scss';

const DownloadsComponent = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('A1');

  // APIs para cada nivel
  const API_URLS = {
    'A1': 'https://nuevaescuelamexicana.sep.gob.mx/api/contenido/coleccion/?alineador=A&page=1',
    'A2': 'https://nuevaescuelamexicana.sep.gob.mx/api/contenido/coleccion/?alineador=A2&page=1',
    'B1': 'https://nuevaescuelamexicana.sep.gob.mx/api/contenido/coleccion/?alineador=B1&page=1',
    'B2': 'https://nuevaescuelamexicana.sep.gob.mx/api/contenido/coleccion/?alineador=B2&page=1'
  };

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(API_URLS[activeTab]);
        if (!response.ok) throw new Error('Error al obtener los datos');
        
        const data = await response.json();
        setLevels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [activeTab]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const availableLevels = ['A1', 'A2', 'B1', 'B2'];

  const openResource = (resourceId, resourceName) => {
    // Extraer nivel y tipo de recurso del nombre
    // Formato esperado: "A1. Listening" o "B2. Grammar", etc.
    const parts = resourceName.split('. ');
    if (parts.length >= 2) {
      const nivel = parts[0].toLowerCase(); // a1, a2, b1, b2
      const recurso = parts[1].toLowerCase(); // listening, reading, etc.
      
      // Redirigir a jobs con parámetros
      window.location.href = `http://emi.aprende.gob.mx/jobs?nivel=${nivel}&recurso=${recurso}&id=${resourceId}`;
    } else {
      // Fallback si no se puede parsear el nombre
      window.location.href = '/jobs';
    }
  };

  return (
    <div className="downloads-container">
      <h2>Niveles EMI</h2>
      
      <div className="tabs">
        {availableLevels.map(levelName => (
          <button
            key={levelName}
            className={`tab-button ${activeTab === levelName ? 'active' : ''}`}
            onClick={() => setActiveTab(levelName)}
          >
            Level {levelName}
          </button>
        ))}
      </div>
      
      <div className="levels-grid">
        {levels.length === 0 ? (
          <div className="alert alert-warning text-dark" role="alert">
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-triangle"></i> Información
            </h4>
            <p className="mb-0">No se encontraron recursos para el nivel {activeTab}</p>
            <hr />
            <p className="mb-0">Esto puede deberse a que el nivel seleccionado aún no tiene contenido disponible. Intenta con otro nivel.</p>
            <p className="mb-0">
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise"></i> Recargar página
              </button>
            </p>
          </div>
        ) : (
          levels.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="level-card"
              onClick={() => openResource(item.id, item.nombre || 'Recurso')}
              style={{ cursor: 'pointer' }}
            >
              <div className="level-thumbnail">
                <img 
                  src={item.portada || '/static/images/default-course.jpg'} 
                  alt={item.nombre || 'Recurso'}
                  onError={(e) => {
                    e.target.src = '/static/images/default-course.jpg';
                  }}
                />
              </div>
              
              <div className="level-info">
                <h3>{item.nombre || 'Recurso'}</h3>
                
                <div className="level-details">
                  <div className="institution">
                    <span>ID: </span>
                    <span>{item.id}</span>
                  </div>
                  
                  <div className="status">
                    <span>Nivel: </span>
                    <span>{activeTab}</span>
                  </div>
                </div>
                
                <button 
                  className="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openResource(item.id, item.nombre || 'Recurso');
                  }}
                >
                  Acceder Recurso
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DownloadsComponent;