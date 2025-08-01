import React, { useState, useEffect } from 'react';

const DownloadsCarousel = () => {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    const carouselSlides = getCarouselSlides();
    if (carouselSlides.length <= 1) return;
    
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    const carouselSlides = getCarouselSlides();
    if (carouselSlides.length <= 1) return;
    
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
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

      {/* Carrusel de Videos */}
      <div className="container-fluid text-center my-3 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="carousel-wrapper position-relative">
              
              {/* Contenedor del carrusel */}
              <div 
                className="carousel-container-custom overflow-hidden position-relative"
                style={{ 
                  width: '100%',
                  height: 'auto'
                }}
              >
                <div 
                  className="d-flex"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: `${carouselSlides.length * 100}%`
                  }}
                >
                  {carouselSlides.map((slideGroup, slideIndex) => (
                    <div 
                      key={slideIndex}
                      className="w-100 flex-shrink-0"
                      style={{ width: `${100 / carouselSlides.length}%` }}
                    >
                      <div className="row gy-4 justify-content-center mx-2">
                        {slideGroup.map((level, index) => (
                          <div key={`${level.id}-${slideIndex}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
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
                                    background: level.activo 
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
                                  {level.activo ? 'Activo' : 'Inactivo'}
                                </span>
                                
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
                  ))}
                </div>
              </div>
              
              {/* Controles del carrusel solo si hay más de un slide */}
              {carouselSlides.length > 1 && (
                <>
                  <button 
                    className="position-absolute top-50 start-0 translate-middle-y"
                    style={{
                      left: '-2rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                    onClick={prevSlide}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <i className="bi bi-chevron-left text-white" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}></i>
                  </button>
                  <button 
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      right: '-2rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                    onClick={nextSlide}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <i className="bi bi-chevron-right text-white" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}></i>
                  </button>
                </>
              )}
              
              {/* Indicadores de slide */}
              {carouselSlides.length > 1 && (
                <div 
                  className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
                  style={{ zIndex: 10 }}
                >
                  <div className="d-flex gap-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        className="border-0"
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: index === currentSlide 
                            ? 'rgba(90, 18, 44, 0.9)' 
                            : 'rgba(255, 255, 255, 0.4)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsCarousel;
