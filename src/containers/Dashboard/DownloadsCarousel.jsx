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
        // Datos mock para demostración - 5 elementos por cada nivel
        const mockLevels = [
          // Nivel A1 - 5 elementos
          {
            id: 1,
            nombre: 'A1',
            nombre_completo: 'Nivel A1 - Matemáticas Básicas',
            portada: 'https://via.placeholder.com/300x200/5a122c/ffffff?text=A1+Matemáticas',
            color: '#5a122c',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Matemáticas' }
          },
          {
            id: 2,
            nombre: 'A1',
            nombre_completo: 'Nivel A1 - Español Literatura',
            portada: 'https://via.placeholder.com/300x200/5a122c/ffffff?text=A1+Español',
            color: '#5a122c',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Literatura' }
          },
          {
            id: 3,
            nombre: 'A1',
            nombre_completo: 'Nivel A1 - Historia Universal',
            portada: 'https://via.placeholder.com/300x200/5a122c/ffffff?text=A1+Historia',
            color: '#5a122c',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Historia' }
          },
          {
            id: 4,
            nombre: 'A1',
            nombre_completo: 'Nivel A1 - Biología Básica',
            portada: 'https://via.placeholder.com/300x200/5a122c/ffffff?text=A1+Biología',
            color: '#5a122c',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Ciencias' }
          },
          {
            id: 5,
            nombre: 'A1',
            nombre_completo: 'Nivel A1 - Química Introductoria',
            portada: 'https://via.placeholder.com/300x200/5a122c/ffffff?text=A1+Química',
            color: '#5a122c',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Ciencias' }
          },
          // Nivel B1 - 5 elementos
          {
            id: 6,
            nombre: 'B1',
            nombre_completo: 'Nivel B1 - Álgebra Intermedia',
            portada: 'https://via.placeholder.com/300x200/8b1538/ffffff?text=B1+Álgebra',
            color: '#8b1538',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Matemáticas' }
          },
          {
            id: 7,
            nombre: 'B1',
            nombre_completo: 'Nivel B1 - Física Mecánica',
            portada: 'https://via.placeholder.com/300x200/8b1538/ffffff?text=B1+Física',
            color: '#8b1538',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Ciencias' }
          },
          {
            id: 8,
            nombre: 'B1',
            nombre_completo: 'Nivel B1 - Inglés Intermedio',
            portada: 'https://via.placeholder.com/300x200/8b1538/ffffff?text=B1+Inglés',
            color: '#8b1538',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Idiomas' }
          },
          {
            id: 9,
            nombre: 'B1',
            nombre_completo: 'Nivel B1 - Historia de México',
            portada: 'https://via.placeholder.com/300x200/8b1538/ffffff?text=B1+México',
            color: '#8b1538',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Historia' }
          },
          {
            id: 10,
            nombre: 'B1',
            nombre_completo: 'Nivel B1 - Programación Básica',
            portada: 'https://via.placeholder.com/300x200/8b1538/ffffff?text=B1+Programación',
            color: '#8b1538',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Tecnología' }
          },
          // Nivel C1 - 5 elementos
          {
            id: 11,
            nombre: 'C1',
            nombre_completo: 'Nivel C1 - Cálculo Diferencial',
            portada: 'https://via.placeholder.com/300x200/b71c4d/ffffff?text=C1+Cálculo',
            color: '#b71c4d',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Matemáticas' }
          },
          {
            id: 12,
            nombre: 'C1',
            nombre_completo: 'Nivel C1 - Química Avanzada',
            portada: 'https://via.placeholder.com/300x200/b71c4d/ffffff?text=C1+Química+Avanzada',
            color: '#b71c4d',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Ciencias' }
          },
          {
            id: 13,
            nombre: 'C1',
            nombre_completo: 'Nivel C1 - Literatura Contemporánea',
            portada: 'https://via.placeholder.com/300x200/b71c4d/ffffff?text=C1+Literatura',
            color: '#b71c4d',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Literatura' }
          },
          {
            id: 14,
            nombre: 'C1',
            nombre_completo: 'Nivel C1 - Física Cuántica',
            portada: 'https://via.placeholder.com/300x200/b71c4d/ffffff?text=C1+Cuántica',
            color: '#b71c4d',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Ciencias' }
          },
          {
            id: 15,
            nombre: 'C1',
            nombre_completo: 'Nivel C1 - Desarrollo Web Avanzado',
            portada: 'https://via.placeholder.com/300x200/b71c4d/ffffff?text=C1+Web+Dev',
            color: '#b71c4d',
            activo: true,
            raiz: { nombre_completo: 'EMI - Educación Media Superior » Tecnología' }
          }
        ];

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        setLevels(mockLevels);

        // Código original comentado para uso futuro:
        /*
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
        */
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
  const availableTabs = [...new Set(levels.map(level => level.nombre))];

  return (
    <div className="downloads-container">
      <h2>Niveles EMI</h2>
      
      <div className="tabs">
        {availableTabs.map(tabName => {
          const levelForColor = levels.find(level => level.nombre === tabName);
          return (
            <button
              key={tabName}
              className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
              style={{ borderBottomColor: levelForColor?.color }}
            >
              {tabName}
            </button>
          );
        })}
      </div>
      
      {activeLevels.length > 0 && (
        <div className="levels-grid">
          {activeLevels.map((level) => (
            <div key={level.id} className="level-card">
              <div className="level-thumbnail">
                <img src={level.portada} alt={`Portada ${level.nombre_completo}`} />
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
      )}
    </div>
  );
};

export default DownloadsComponent;