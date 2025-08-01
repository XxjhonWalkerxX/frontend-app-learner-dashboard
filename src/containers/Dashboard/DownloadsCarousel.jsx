// DownloadsCarousel.jsx
import React, { useEffect, useState } from 'react';
import './index.scss';

const API_URL =
  'https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi';

const DownloadsCarousel = () => {
  const [levelsData, setLevelsData]     = useState([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const filtered = data.filter(item => item.portada?.trim());
        if (!filtered.length) throw new Error('No se encontraron niveles con portada');
        setLevelsData(filtered);
        setCurrentLevel(filtered[0].slug);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getDisplayLevels = () => {
    let items = levelsData.filter(l => l.slug === currentLevel);
    while (items.length < 4 && levelsData.length) {
      items = items.concat(levelsData.filter(l => l.slug === currentLevel));
    }
    return items.slice(0, 4);
  };

  const openLevel = slug => alert(`Abriendo nivel ${slug.toUpperCase()}`);

  if (loading) {
    return (
      <div className="fondo_verde_oscuro text-center py-5 text-white">
        <div className="spinner-border text-light" role="status" />
        <p className="mt-2">Cargando niveles...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-warning text-dark m-4">
        <h4><i className="bi bi-exclamation-triangle" /> Error</h4>
        <p>{error}</p>
        <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
          <i className="bi bi-arrow-clockwise" /> Reintentar
        </button>
      </div>
    );
  }
  if (!levelsData.length) return null;

  const uniqueLevels  = Array.from(new Map(levelsData.map(l => [l.slug,l])).values());
  const displayLevels = getDisplayLevels();

  return (
    <>
      <div className="row">
        <div className="col-md-2 mb-3">
          <select
            className="form-select select_nivel"
            value={currentLevel}
            onChange={e => setCurrentLevel(e.target.value)}
          >
            {uniqueLevels.map(lvl => (
              <option key={lvl.slug} value={lvl.slug}>
                Level {lvl.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-12 fondo_verde_oscuro mt-5 position-relative">
          <div
            id="sepCarousel"
            className="carousel slide"
            data-bs-interval="false"
            data-bs-ride="false"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row g-3">
                  {displayLevels.map((lvl, i) => {
                    const imgSrc = lvl.portada || '/static/images/default-course.jpg';
                    return (
                      <div key={i} className="col-lg-3 col-md-6 col-sm-12">
                        <div
                          className="card bg-dark text-white h-100 position-relative"
                          style={{ cursor: 'pointer' }}
                          onClick={() => openLevel(lvl.slug)}
                        >
                          <div className="position-relative">
                            <img
                              src={imgSrc}
                              alt={lvl.nombre_completo}
                              className="card-img-top"
                              style={{ height: '200px', objectFit: 'cover' }}
                              onError={e => e.currentTarget.src = '/static/images/default-course.jpg'}
                              loading="lazy"
                            />
                            <div className="position-absolute top-0 end-0 m-2">
                              {lvl.activo
                                ? <span className="badge bg-success">Activo</span>
                                : <span className="badge bg-secondary">Inactivo</span>}
                            </div>
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <div 
                                className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '60px', height: '60px' }}
                              >
                                <i className="bi bi-play-fill" style={{ fontSize: '24px' }}></i>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title fw-bold">{lvl.tipo?.nombre}: {lvl.nombre}</h5>
                            <p className="card-text mb-1">{lvl.nivel?.nombre}</p>
                            <p className="card-text mb-2">{lvl.raiz?.nombre}</p>
                            <div className="mt-auto">
                              {lvl.suscrito
                                ? <span className="badge bg-primary">
                                    <i className="bi bi-check-circle me-1" />Suscrito
                                  </span>
                                : <span className="badge bg-outline-light">
                                    <i className="bi bi-plus-circle me-1" />Suscribirse
                                  </span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y"
              type="button"
              data-bs-target="#sepCarousel"
              data-bs-slide="prev"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%',
                border: 'none',
                marginLeft: '10px'
              }}
            >
              <i className="bi bi-chevron-left text-white" style={{ fontSize: '20px' }}></i>
            </button>
            <button
              className="carousel-control-next position-absolute top-50 end-0 translate-middle-y"
              type="button"
              data-bs-target="#sepCarousel"
              data-bs-slide="next"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%',
                border: 'none',
                marginRight: '10px'
              }}
            >
              <i className="bi bi-chevron-right text-white" style={{ fontSize: '20px' }}></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadsCarousel;
