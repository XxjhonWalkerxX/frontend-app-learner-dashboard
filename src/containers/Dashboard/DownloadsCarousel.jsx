import React, { useState, useEffect } from 'react';
import './DownloadsComponent.scss';

const DownloadsComponent = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('A1');

  const exampleLevels = [
    // Nivel A1
    ...Array(5).fill().map((_, i) => ({
      id: `a1-${i+1}`,
      nombre: 'A1',
      nombre_completo: `Nivel Básico A1 - ${[
        'Introducción al Inglés', 
        'Gramática Fundamental', 
        'Vocabulario Esencial',
        'Conversación Inicial',
        'Pronunciación Básica'
      ][i]}`,
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    })),
    // Nivel B1
    ...Array(5).fill().map((_, i) => ({
      id: `b1-${i+1}`,
      nombre: 'B1',
      nombre_completo: `Nivel Intermedio B1 - ${[
        'Comunicación Efectiva',
        'Gramática Avanzada',
        'Comprensión de Lectura',
        'Escritura Formal',
        'Listening Comprehension'
      ][i]}`,
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    })),
    // Nivel C1
    ...Array(5).fill().map((_, i) => ({
      id: `c1-${i+1}`,
      nombre: 'C1',
      nombre_completo: `Nivel Avanzado C1 - ${[
        'Fluidez y Precisión',
        'Inglés Académico',
        'Business English',
        'Cultura y Literatura',
        'Preparación IELTS'
      ][i]}`,
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    }))
  ];

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi');
        if (!response.ok) throw new Error('Error al obtener los datos');
        
        const data = await response.json();
        const filteredLevels = data.filter(level => 
          level.portada && ['A1', 'B1', 'C1'].includes(level.nombre)
        );
        
        setLevels([...filteredLevels, ...exampleLevels]);
      } catch (err) {
        setLevels(exampleLevels);
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