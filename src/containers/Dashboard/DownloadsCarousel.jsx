import React, { useState, useEffect } from 'react';
import './DownloadsComponent.scss';

const DownloadsComponent = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('A1');

  // Ejemplos estáticos para cada nivel
  const exampleLevels = [
    // Ejemplos A1
    {
      id: 'a1-1',
      nombre: 'A1',
      nombre_completo: 'Nivel Básico A1 - Introducción al Inglés',
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'a1-2',
      nombre: 'A1',
      nombre_completo: 'Nivel Básico A1 - Gramática Fundamental',
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'a1-3',
      nombre: 'A1',
      nombre_completo: 'Nivel Básico A1 - Vocabulario Esencial',
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'a1-4',
      nombre: 'A1',
      nombre_completo: 'Nivel Básico A1 - Conversación Inicial',
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'a1-5',
      nombre: 'A1',
      nombre_completo: 'Nivel Básico A1 - Pronunciación Básica',
      portada: 'assets/certificado.png',
      color: '#5a122ce6',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    // Ejemplos B1
    {
      id: 'b1-1',
      nombre: 'B1',
      nombre_completo: 'Nivel Intermedio B1 - Comunicación Efectiva',
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'b1-2',
      nombre: 'B1',
      nombre_completo: 'Nivel Intermedio B1 - Gramática Avanzada',
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'b1-3',
      nombre: 'B1',
      nombre_completo: 'Nivel Intermedio B1 - Comprensión de Lectura',
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'b1-4',
      nombre: 'B1',
      nombre_completo: 'Nivel Intermedio B1 - Escritura Formal',
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'b1-5',
      nombre: 'B1',
      nombre_completo: 'Nivel Intermedio B1 - Listening Comprehension',
      portada: 'assets/certificado.png',
      color: '#FF9800',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    // Ejemplos C1
    {
      id: 'c1-1',
      nombre: 'C1',
      nombre_completo: 'Nivel Avanzado C1 - Fluidez y Precisión',
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'c1-2',
      nombre: 'C1',
      nombre_completo: 'Nivel Avanzado C1 - Inglés Académico',
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'c1-3',
      nombre: 'C1',
      nombre_completo: 'Nivel Avanzado C1 - Business English',
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'c1-4',
      nombre: 'C1',
      nombre_completo: 'Nivel Avanzado C1 - Cultura y Literatura',
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    },
    {
      id: 'c1-5',
      nombre: 'C1',
      nombre_completo: 'Nivel Avanzado C1 - Preparación IELTS',
      portada: 'assets/certificado.png',
      color: '#9C27B0',
      activo: true,
      raiz: { nombre_completo: 'Escuela Mexicana de Inglés » EMI' }
    }
  ];

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
        
        // Combinar con ejemplos estáticos
        const combinedLevels = [...filteredLevels, ...exampleLevels];
        setLevels(combinedLevels);
      } catch (err) {
        // Si hay error, usar solo los ejemplos estáticos
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
        {uniqueTabs.map(levelName => {
          const level = levels.find(l => l.nombre === levelName);
          return (
            <button
              key={levelName}
              className={`tab-button ${activeTab === levelName ? 'active' : ''}`}
              onClick={() => setActiveTab(levelName)}
            >
              {levelName}
            </button>
          );
        })}
      </div>
      
      <div className="levels-grid">
        {activeLevels.map((level, index) => (
          <div key={`${level.id}-${index}`} className="level-card">
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