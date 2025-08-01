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

  const nextSlide = () => {
    if (isTransitioning || levels.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % levels.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || levels.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + levels.length) % levels.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
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
        <div className="carousel-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {levels.map((level, index) => (
            <div 
              key={level.id} 
              className={`level-card ${index === currentSlide ? 'active' : ''}`}
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
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        {levels.length > 1 && (
          <>
            <button 
              className="carousel-nav prev" 
              onClick={prevSlide}
              disabled={isTransitioning}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="carousel-nav next" 
              onClick={nextSlide}
              disabled={isTransitioning}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}

        {/* Indicadores de slide */}
        {levels.length > 1 && (
          <div className="carousel-indicators">
            {levels.map((_, index) => (
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
