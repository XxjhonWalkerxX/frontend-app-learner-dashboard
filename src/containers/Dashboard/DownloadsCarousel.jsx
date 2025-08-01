import React, { useState, useEffect } from 'react';

// Datos mock para completar cuando hay pocos elementos
const mockLevels = [
  {
    id: 'mock-1',
    nombre: 'A1',
    nombre_completo: 'Inglés Básico A1',
    slug: 'ingles-a1',
    portada: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Básico' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  },
  {
    id: 'mock-2',
    nombre: 'A1',
    nombre_completo: 'Inglés Elemental A2',
    slug: 'ingles-a2',
    portada: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Elemental' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  },
  {
    id: 'mock-3',
    nombre: 'B1',
    nombre_completo: 'Inglés Intermedio B1',
    slug: 'ingles-b1',
    portada: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Intermedio' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  },
  {
    id: 'mock-4',
    nombre: 'B1',
    nombre_completo: 'Inglés Intermedio Alto B2',
    slug: 'ingles-b2',
    portada: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Intermedio Alto' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  },
  {
    id: 'mock-5',
    nombre: 'C1',
    nombre_completo: 'Inglés Avanzado C1',
    slug: 'ingles-c1',
    portada: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Avanzado' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  },
  {
    id: 'mock-6',
    nombre: 'C1',
    nombre_completo: 'Inglés Competencia C2',
    slug: 'ingles-c2',
    portada: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    activo: true,
    nivel: { nombre: 'Competencia' },
    raiz: { nombre: 'Inglés' },
    tipo: { portada: null }
  }
];

const DownloadsCarousel = () => {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtrar solo los que tienen portada
      const filteredData = data.filter(item => item.portada && item.portada.trim() !== '');
      
      let finalData = filteredData;
      
      // Si hay pocos elementos (menos de 7), agregar datos mock
      if (filteredData.length < 7) {
        const needed = 7 - filteredData.length;
        const mockToAdd = mockLevels.slice(0, needed);
        
        // Asegurar que los mocks tengan el mismo slug que los reales para el selector
        const mockWithSlug = mockToAdd.map((mock, index) => ({
          ...mock,
          slug: filteredData.length > 0 ? filteredData[0].slug : 'mock-level',
          nivel: filteredData.length > 0 ? filteredData[0].nivel : mock.nivel,
          raiz: filteredData.length > 0 ? filteredData[0].raiz : mock.raiz
        }));
        
        finalData = [...filteredData, ...mockWithSlug];
      }
      
      if (finalData.length === 0) {
        throw new Error('No se encontraron niveles con portada');
      }

      setLevels(finalData);

      // Establecer el primer nivel como actual
      if (finalData.length > 0) {
        setCurrentLevel(finalData[0].slug);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      // Si hay error de conexión, usar solo datos mock
      console.log('Usando datos mock debido a error de conexión');
      const mockData = mockLevels.map(mock => ({
        ...mock,
        slug: 'mock-level'
      }));
      
      setLevels(mockData);
      if (mockData.length > 0) {
        setCurrentLevel(mockData[0].slug);
      }
      
      setError(`Error de conexión: ${error.message}. Mostrando contenido de ejemplo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e) => {
    setCurrentLevel(e.target.value);
  };

  const openLevel = (level) => {
    if (level.id && typeof level.id === 'string' && level.id.startsWith('mock-')) {
      alert(`📚 Contenido de ejemplo: ${level.nombre_completo}\n\n¡Pronto tendrás acceso a este nivel! 🚀`);
    } else {
      alert(`🎯 Abriendo nivel real: ${level.nombre.toUpperCase()}\n\n${level.nombre_completo}`);
    }
  };

  // Obtener niveles únicos para el selector
  const getUniqueLevels = () => {
    const uniqueLevels = [];
    const seenSlugs = new Set();
    
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      if (!seenSlugs.has(level.slug)) {
        seenSlugs.add(level.slug);
        uniqueLevels.push(level);
      }
    }
    return uniqueLevels;
  };

  // Filtrar niveles según el nivel actual seleccionado
  const getCurrentLevelData = () => {
    return levels.filter(level => level.slug === currentLevel);
  };

  if (loading) {
    return (
      <div className="fondo_verde_oscuro mt-5">
        <div className="row mt-5 mlef">
          <div className="col-md-12 text-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-white">Cargando niveles desde SEP...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fondo_verde_oscuro mt-5">
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="alert alert-warning text-dark" role="alert">
              <h4 className="alert-heading">
                <i className="bi bi-exclamation-triangle"></i> Error al cargar contenido
              </h4>
              <p className="mb-0">{error}</p>
              <hr />
              <p className="mb-0">
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={loadData}
                >
                  <i className="bi bi-arrow-clockwise"></i> Intentar nuevamente
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const uniqueLevels = getUniqueLevels();

  return (
    <div className="fondo_verde_oscuro mt-5">
      {/* Select de nivel */}
      <div className="row mt-5 mlef">
        <div className="col-md-4">
          <div className="mb-3">
            <label 
              htmlFor="levelSelector" 
              className="form-label fw-bold mb-2"
              style={{ 
                color: '#5a122c',
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem'
              }}
            >
              Selecciona un Nivel
            </label>
            <select 
              id="levelSelector" 
              className="form-select" 
              value={currentLevel}
              onChange={handleLevelChange}
              aria-label="Selector de nivel"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(90, 18, 44, 0.6)',
                borderRadius: '12px',
                color: '#5a122c',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(90, 18, 44, 1)';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(90, 18, 44, 0.25)';
                e.target.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(90, 18, 44, 0.6)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              {uniqueLevels.map((level, index) => (
                <option 
                  key={level.slug} 
                  value={level.slug}
                  style={{
                    backgroundColor: '#5a122c',
                    color: 'white'
                  }}
                >
                  Level {level.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scroll Horizontal de Videos */}
      <div className="container-fluid text-center my-3 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="downloads-scroll-wrapper">
              
              {/* Contenedor con scroll horizontal */}
              <div 
                className="downloads-scroll-container"
                style={{ 
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%',
                  paddingBottom: '1rem',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(90, 18, 44, 0.6) rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="d-flex"
                  style={{ 
                    gap: '1rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    minWidth: 'fit-content'
                  }}
                >
                  {getCurrentLevelData().map((level, index) => (
                    <div 
                      key={`${level.id}-${index}`} 
                      className="flex-shrink-0"
                      style={{ 
                        width: '280px',
                        minWidth: '280px'
                      }}
                    >
                      <div 
                        className="card h-100 position-relative downloads-card glass-morphism" 
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: '16px', 
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => openLevel(level)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                              <div className="position-relative">
                                <img 
                                  className="card-img-top" 
                                  src={level.portada || level.tipo?.portada || level.nivel?.portada} 
                                  alt={level.nombre_completo}
                                  onError={(e) => {
                                    e.target.src = '/static/images/default-course.jpg';
                                  }}
                                  loading="lazy"
                                  style={{ 
                                    objectFit: 'cover', 
                                    height: '200px'
                                  }}
                                />
                                
                                {/* Overlay glassmorphism en la imagen */}
                                <div 
                                  className="position-absolute"
                                  style={{
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(135deg, rgba(90, 18, 44, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(90, 18, 44, 0.05) 100%)'
                                  }}
                                />
                                
                                {/* Badge de estado en la esquina superior derecha */}
                                <span 
                                  className="badge position-absolute top-0 end-0 m-2" 
                                  style={{ 
                                    background: level.id && typeof level.id === 'string' && level.id.startsWith('mock-')
                                      ? 'linear-gradient(135deg, #fd7e14, #e55d87)'  // Orange gradient para mock
                                      : level.activo 
                                        ? 'linear-gradient(135deg, #28a745, #20c997)' 
                                        : 'linear-gradient(135deg, #6c757d, #495057)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    padding: '0.5rem 0.8rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                  }}
                                >
                                  {level.id && typeof level.id === 'string' && level.id.startsWith('mock-') 
                                    ? '📚 Ejemplo' 
                                    : level.activo ? 'Activo' : 'Inactivo'}
                                </span>
                                
                                {/* Badge adicional para contenido mock en la esquina superior izquierda */}
                                {level.id && typeof level.id === 'string' && level.id.startsWith('mock-') && (
                                  <span 
                                    className="badge position-absolute top-0 start-0 m-2" 
                                    style={{ 
                                      background: 'linear-gradient(135deg, rgba(90, 18, 44, 0.9), rgba(139, 21, 56, 0.9))',
                                      color: 'white',
                                      border: '1px solid rgba(255, 255, 255, 0.3)',
                                      backdropFilter: 'blur(10px)',
                                      borderRadius: '12px',
                                      padding: '0.4rem 0.6rem',
                                      fontSize: '0.7rem',
                                      fontWeight: '600'
                                    }}
                                  >
                                    🚀 Próximamente
                                  </span>
                                )}
                                
                                {/* Icono de play en el centro con efecto glassmorphism */}
                                <div 
                                  className="position-absolute top-50 start-50 translate-middle"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '50%',
                                    width: '70px',
                                    height: '70px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <i 
                                    className="bi bi-play-fill text-white" 
                                    style={{ fontSize: '2rem', marginLeft: '4px' }}
                                  ></i>
                                </div>
                              </div>
                              
                              <div 
                                className="card-body p-3"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                                  color: '#5a122c'
                                }}
                              >
                                <h5 
                                  className="card-title fw-bold mb-2" 
                                  style={{ 
                                    fontSize: '1.1rem', 
                                    color: '#5a122c'
                                  }}
                                >
                                  Level: {level.nombre}
                                </h5>
                                <p 
                                  className="card-text mb-1 small"
                                  style={{ 
                                    color: '#8b1538',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {level.nivel.nombre}
                                </p>
                                <p 
                                  className="card-text mb-0 small"
                                  style={{ 
                                    color: '#8b1538',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {level.raiz.nombre}
                                </p>
                            </div>
                          </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll personalizado con estilo glassmorphism */}
              <style jsx>{`
                .downloads-scroll-container::-webkit-scrollbar {
                  height: 8px;
                }
                .downloads-scroll-container::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  border-radius: 10px;
                  margin: 0 1rem;
                }
                .downloads-scroll-container::-webkit-scrollbar-thumb {
                  background: linear-gradient(135deg, rgba(90, 18, 44, 0.8), rgba(139, 21, 56, 0.8));
                  border-radius: 10px;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .downloads-scroll-container::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(135deg, rgba(90, 18, 44, 1), rgba(139, 21, 56, 1));
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsCarousel;
