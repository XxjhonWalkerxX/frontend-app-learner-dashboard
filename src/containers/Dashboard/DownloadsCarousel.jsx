import React, { useState, useEffect } from 'react';

const DownloadsCarousel = () => {
  const [levels, setLevels] = useState([]);
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

    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openLevel = (level) => {
    window.open(`https://nemd.aprende.gob.mx/nivel/${level.slug}/`, '_blank');
  };

  if (loading) {
    return (
      <div className="downloads-container">
        <div className="downloads-header">
          <h2 className="downloads-title">
            <i className="bi bi-download me-3"></i>
            Recursos Educativos
          </h2>
          <p className="downloads-subtitle">Explora los diferentes niveles de inglés disponibles</p>
        </div>
        <div className="downloads-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p className="loading-text">Cargando recursos educativos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="downloads-container">
        <div className="downloads-header">
          <h2 className="downloads-title">
            <i className="bi bi-download me-3"></i>
            Recursos Educativos
          </h2>
        </div>
        <div className="downloads-error">
          <div className="error-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h3>Error al cargar contenido</h3>
          <p>{error}</p>
          <button className="error-retry-btn" onClick={loadData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular el ancho de cada slide basado en el número de elementos y el tamaño de pantalla
  const getSlideWidth = () => {
    if (typeof window === 'undefined') return 33.333;
    
    const width = window.innerWidth;
    
    if (width <= 768) {
      // Móvil: 1 elemento
      return 100;
    } else if (width <= 992) {
      // Tablet: 2 elementos
      if (levels.length === 1) return 100;
      return 50;
    } else {
      // Desktop: 3 elementos
      if (levels.length === 1) return 100;
      if (levels.length === 2) return 50;
      return 33.333;
    }
  };

  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 3;
    
    const width = window.innerWidth;
    
    if (width <= 768) {
      return 1; // Móvil
    } else if (width <= 992) {
      return Math.min(2, levels.length); // Tablet
    } else {
      return Math.min(3, levels.length); // Desktop
    }
  };

  const [slideWidth, setSlideWidth] = useState(33.333);
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setSlideWidth(getSlideWidth());
      setVisibleSlides(getVisibleSlides());
      setCurrentSlide(0); // Reset slide position on resize
    };

    // Inicializar valores al cargar
    if (typeof window !== 'undefined') {
      setSlideWidth(getSlideWidth());
      setVisibleSlides(getVisibleSlides());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [levels.length]);

  const maxSlide = Math.max(0, levels.length - visibleSlides);

  const nextSlide = () => {
    if (isTransitioning || levels.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || levels.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(Math.min(index, maxSlide));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="downloads-container">
      {/* Header con título y descripción */}
      <div className="downloads-header">
        <h2 className="downloads-title">
          <i className="bi bi-download me-3"></i>
          Recursos Educativos
        </h2>
        <p className="downloads-subtitle">Explora los diferentes niveles de inglés disponibles</p>
        <div className="downloads-stats">
          <span className="stat-item">
            <i className="bi bi-collection-play me-2"></i>
            {levels.length} {levels.length === 1 ? 'Nivel' : 'Niveles'}
          </span>
        </div>
      </div>

      {/* Carrusel moderno */}
      <div className="downloads-carousel-wrapper">
        <div className="carousel-container" style={{ transform: `translateX(-${currentSlide * slideWidth}%)` }}>
          {levels.map((level, index) => (
            <div 
              key={level.id} 
              className={`level-card`}
              style={{ flex: `0 0 ${slideWidth}%` }}
              onClick={() => openLevel(level)}
            >
              <div className="card-image-wrapper">
                <img 
                  src={level.portada} 
                  alt={level.nombre_completo}
                  className="level-image"
                  onError={(e) => {
                    e.target.src = level.tipo?.portada || level.nivel?.portada || '/static/images/default-course.jpg';
                  }}
                />
                <div className="image-overlay">
                  <div className="play-button">
                    <i className="bi bi-play-circle-fill"></i>
                  </div>
                  <div className="level-badge">
                    Level {level.nombre}
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="level-header">
                  <h3 className="level-name">Level {level.nombre}</h3>
                  <span className={`status-badge ${level.activo ? 'active' : 'inactive'}`}>
                    {level.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="level-details">
                  <p className="level-program">{level.nivel.nombre}</p>
                  <p className="level-section">{level.raiz.nombre}</p>
                </div>
                
                <div className="card-footer">
                  <button className={`subscribe-btn ${level.suscrito ? 'subscribed' : ''}`}>
                    <i className={`bi ${level.suscrito ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-2`}></i>
                    {level.suscrito ? 'Suscrito' : 'Suscribirse'}
                  </button>
                  <button className="download-btn">
                    <i className="bi bi-download me-2"></i>
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        {maxSlide > 0 && (
          <>
            <button 
              className="carousel-nav prev" 
              onClick={prevSlide}
              disabled={isTransitioning || currentSlide === 0}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="carousel-nav next" 
              onClick={nextSlide}
              disabled={isTransitioning || currentSlide === maxSlide}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}

        {/* Indicadores de slide */}
        {maxSlide > 0 && (
          <div className="carousel-indicators">
            {Array.from({ length: maxSlide + 1 }, (_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsCarousel;
