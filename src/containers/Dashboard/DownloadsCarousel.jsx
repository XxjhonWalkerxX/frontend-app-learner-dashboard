import React, { useState, useEffect } from 'react';

const DownloadsCarousel = () => {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

      // Establecer el primer nivel como actual
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

  const nextSlide = () => {
    if (isTransitioning) return;
    const carouselSlides = getCarouselSlides();
    if (carouselSlides.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    const carouselSlides = getCarouselSlides();
    if (carouselSlides.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleLevelChange = (e) => {
    setCurrentLevel(e.target.value);
    setCurrentSlide(0); // Reset slide cuando cambie el nivel
  };

  const openLevel = (level) => {
    alert(`Abriendo nivel ${level.nombre.toUpperCase()}`);
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

  // Helper para dividir los elementos en grupos de 4 para el carrusel
  const getCarouselSlides = () => {
    const displayLevels = getCurrentLevelData();
    const slides = [];
    for (let i = 0; i < displayLevels.length; i += 4) {
      slides.push(displayLevels.slice(i, i + 4));
    }
    return slides;
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
  const carouselSlides = getCarouselSlides();

  return (
    <div className="fondo_verde_oscuro mt-5">
      {/* Select de nivel */}
      <div className="row mt-5 mlef">
        <div className="col-md-3">
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
      </div>

      {/* Carrusel de Videos */}
      <div className="container-fluid text-center my-3 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="carousel-wrapper position-relative">
              
              {/* Contenedor del carrusel */}
              <div className="carousel-container-custom overflow-hidden">
                <div 
                  className="carousel-slides-wrapper d-flex transition-transform"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                  }}
                >
                  {carouselSlides.map((slideGroup, slideIndex) => (
                    <div 
                      key={slideIndex}
                      className="carousel-slide-custom d-flex justify-content-center w-100 flex-shrink-0"
                    >
                      <div className="row gy-4 w-100 justify-content-center">
                        {slideGroup.map((level, index) => (
                          <div key={`${level.id}-${slideIndex}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div 
                              className="card bg-white text-dark h-100 position-relative downloads-card" 
                              style={{ 
                                cursor: 'pointer', 
                                borderRadius: '12px', 
                                overflow: 'hidden'
                              }}
                              onClick={() => openLevel(level)}
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
                                  style={{ objectFit: 'cover', height: '200px' }}
                                />
                                
                                {/* Badge de estado en la esquina superior derecha */}
                                <span className="badge position-absolute top-0 end-0 m-2" 
                                      style={{ 
                                        backgroundColor: level.activo ? '#28a745' : '#6c757d',
                                        color: 'white'
                                      }}>
                                  {level.activo ? 'Activo' : 'Inactivo'}
                                </span>
                                
                                {/* Icono de play en el centro */}
                                <div className="position-absolute top-50 start-50 translate-middle">
                                  <i 
                                    className="bi bi-play-circle-fill text-white" 
                                    style={{ fontSize: '3rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                  ></i>
                                </div>
                              </div>
                              
                              <div className="card-body p-3">
                                <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                                  Level: {level.nombre}
                                </h5>
                                <p className="card-text mb-1 small text-muted">
                                  {level.nivel.nombre}
                                </p>
                                <p className="card-text mb-0 small text-muted">
                                  {level.raiz.nombre}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Controles del carrusel solo si hay más de un slide */}
              {carouselSlides.length > 1 && (
                <>
                  <button 
                    className="carousel-control-custom carousel-control-prev-custom" 
                    onClick={prevSlide}
                    disabled={isTransitioning}
                  >
                    <i className="bi bi-chevron-left text-white fs-3"></i>
                  </button>
                  <button 
                    className="carousel-control-custom carousel-control-next-custom" 
                    onClick={nextSlide}
                    disabled={isTransitioning}
                  >
                    <i className="bi bi-chevron-right text-white fs-3"></i>
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
