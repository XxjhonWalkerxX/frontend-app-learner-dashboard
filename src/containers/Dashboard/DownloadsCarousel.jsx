import React, { useState, useEffect } from 'react';

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
      
      if (filteredData.length === 0) {
        throw new Error('No se encontraron niveles con portada');
      }

      setLevels(filteredData);
      
      // Seleccionar el primer nivel por defecto
      if (filteredData.length > 0) {
        setCurrentLevel(filteredData[0].slug);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e) => {
    setCurrentLevel(e.target.value);
  };

  const openLevel = (slug, id) => {
    alert(`Abriendo nivel ${slug.toUpperCase()}`);
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
    let displayLevels = levels.filter(level => level.slug === currentLevel);
    
    // Si hay pocos elementos, duplicarlos hasta tener al menos 8
    while (displayLevels.length < 8 && levels.length > 0) {
      displayLevels = displayLevels.concat(levels.filter(level => level.slug === currentLevel));
    }
    
    // Limitar a máximo 8 elementos para el carrusel
    return displayLevels.slice(0, 8);
  };

  // Helper para dividir los elementos en grupos para el carrusel
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
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
  const displayLevels = getCurrentLevelData();
  
  // Dividir en grupos de 4 tarjetas por slide
  const carouselSlides = chunkArray(displayLevels, 4);

  return (
    <div className="fondo_verde_oscuro mt-5">
      {/* Select de nivel */}
      <div className="row mt-5 mlef">
        <div className="col-md-2">
          <select 
            id="levelSelector" 
            className="form-select select_nivel" 
            value={currentLevel}
            onChange={handleLevelChange}
            aria-label="Selector de nivel"
          >
            {uniqueLevels.map((level, index) => (
              <option key={level.slug} value={level.slug}>
                Level {level.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-10">
          {loading && (
            <div className="text-end text-white">
              <i className="bi bi-arrow-clockwise spin me-2"></i>Cargando contenido...
            </div>
          )}
        </div>
      </div>

      {/* Carrusel de Videos */}
      <div className="container-fluid text-center my-3 mb-5">
        <div className="row">
          <div className="row mx-auto my-auto justify-content-center">
            <div 
              id="sepCarousel" 
              className="carousel carousel-dark slide" 
              data-bs-touch="false"
              data-bs-interval="false" 
              data-bs-wrap="false"
            >
              <div className="carousel-inner" role="listbox">
                {carouselSlides.map((slideGroup, slideIndex) => (
                  <div 
                    key={slideIndex}
                    className={`carousel-item${slideIndex === 0 ? ' active' : ''}`}
                  >
                    <div className="row gy-4 justify-content-center">
                      {slideGroup.map((level, index) => (
                        <div key={`${level.id}-${slideIndex}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <div 
                            className="card bg-dark text-white h-100" 
                            data-level-id={`${level.id}-${slideIndex}-${index}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <img 
                              className="card-img" 
                              src={level.portada || level.tipo?.portada || level.nivel?.portada} 
                              alt={level.nombre_completo}
                              onError={(e) => {
                                e.target.src = '/static/images/default-course.jpg';
                              }}
                              loading="lazy"
                              style={{ objectFit: 'cover', height: '400px' }}
                            />
                            <div className="card-img-overlay d-flex flex-column justify-content-between">
                              <div className="d-flex justify-content-center align-items-center flex-grow-1">
                                <i 
                                  className="bi bi-play-circle icon_video" 
                                  style={{ fontSize: '4rem', cursor: 'pointer' }}
                                  onClick={() => openLevel(level.slug, level.id)}
                                ></i>
                              </div>
                              <div>
                                <h5 className="card-title text-start fw-bold text-white montserrat">
                                  {level.tipo.nombre}: {level.nombre}
                                </h5>
                                <p className="card-text text-start mb-0 montserrat">
                                  {level.nivel.nombre}
                                </p>
                                <p className="card-text text-start montserrat">
                                  {level.raiz.nombre}
                                </p>
                                <p className="card-text text-start montserrat">
                                  LEVEL {level.nombre.toUpperCase()}
                                </p>
                              </div>
                              {/* Badge de estado */}
                              {level.activo ? (
                                <span className="badge bg-success position-absolute top-0 end-0 m-2">
                                  Activo
                                </span>
                              ) : (
                                <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                                  Inactivo
                                </span>
                              )}
                              {/* Badge de suscripción */}
                              {level.suscrito ? (
                                <span className="badge bg-primary position-absolute bottom-0 start-0 m-2">
                                  <i className="bi bi-check-circle"></i> Suscrito
                                </span>
                              ) : (
                                <span className="badge bg-outline-light position-absolute bottom-0 start-0 m-2">
                                  <i className="bi bi-plus-circle"></i> Suscribirse
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Controles del carrusel solo si hay más de un slide */}
              {carouselSlides.length > 1 && (
                <>
                  <button 
                    className="carousel-control-prev" 
                    type="button"
                    data-bs-target="#sepCarousel" 
                    data-bs-slide="prev"
                  >
                    <i className="bi bi-chevron-left icon_prev"></i>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button 
                    className="carousel-control-next" 
                    type="button"
                    data-bs-target="#sepCarousel" 
                    data-bs-slide="next"
                  >
                    <i className="bi bi-chevron-right icon_prev"></i>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsCarousel;
