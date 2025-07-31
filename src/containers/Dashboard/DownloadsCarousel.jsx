// DownloadsCarousel.jsx
import React, { useEffect, useState } from 'react';
import './index.scss';

const API_URL = 'https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi';

const DownloadsCarousel = () => {
  const [levelsData, setLevelsData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Carga inicial de datos
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

  // 2. Filtrar y duplicar items para el carrusel
  const getDisplayLevels = () => {
    let items = levelsData.filter(l => l.slug === currentLevel);
    while (items.length < 5 && levelsData.length) {
      items = items.concat(levelsData.filter(l => l.slug === currentLevel));
    }
    return items.slice(0, 5);
  };

  const openLevel = (slug, id) => alert(`Abriendo nivel ${slug.toUpperCase()}`);

  if (loading) {
    return (
      <div className="text-center text-white py-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando niveles desde SEP...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning text-dark" role="alert">
        <h4><i className="bi bi-exclamation-triangle"></i> Error al cargar contenido</h4>
        <p>{error}</p>
        <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
          <i className="bi bi-arrow-clockwise"></i> Intentar nuevamente
        </button>
      </div>
    );
  }

  const uniqueLevels = Array.from(new Map(levelsData.map(l => [l.slug, l])).values());
  const displayLevels = getDisplayLevels();

  return (
    <div className="row">
      <div className="col-md-2">
        <select
          id="levelSelector"
          className="form-select select_nivel"
          value={currentLevel}
          onChange={e => setCurrentLevel(e.target.value)}
        >
          {uniqueLevels.map((lvl, i) => (
            <option key={lvl.slug} value={lvl.slug}>
              Level {lvl.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-12 fondo_verde_oscuro mt-4">
        <div id="sepCarousel" className="carousel carousel-dark slide" data-bs-touch="false" data-bs-interval="false">
          <div className="carousel-inner">
            {displayLevels.map((lvl, i) => {
              const isActive = i === 0 ? 'active' : '';
              const imgSrc = lvl.portada || lvl.tipo?.portada || lvl.nivel?.portada;
              const fallback = '/static/images/default-course.jpg';
              return (
                <div className={`carousel-item ${isActive}`} key={i}>
                  <div className="card bg-dark text-white position-relative" onClick={() => openLevel(lvl.slug, lvl.id)}>
                    <img
                      src={imgSrc}
                      alt={lvl.nombre_completo}
                      className="card-img"
                      onError={e => e.currentTarget.src = fallback}
                      loading="lazy"
                    />
                    <div className="card-img-overlay">
                      <i className="bi bi-play-circle icon_video"></i>
                      <h5 className="fw-bold">{lvl.tipo.nombre}: {lvl.nombre}</h5>
                      <p>{lvl.nivel.nombre}</p>
                      <p>{lvl.raiz.nombre}</p>
                      <p>LEVEL {lvl.nombre.toUpperCase()}</p>
                      {lvl.activo
                        ? <span className="badge bg-success position-absolute top-0 end-0 m-2">Activo</span>
                        : <span className="badge bg-secondary position-absolute top-0 end-0 m-2">Inactivo</span>
                      }
                      {lvl.suscrito
                        ? <span className="badge bg-primary position-absolute bottom-0 start-0 m-2">
                            <i className="bi bi-check-circle"></i> Suscrito
                          </span>
                        : <span className="badge bg-outline-light position-absolute bottom-0 start-0 m-2">
                            <i className="bi bi-plus-circle"></i> Suscribirse
                          </span>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {displayLevels.length > 1 && (
            <>
              <button className="carousel-control-prev" data-bs-target="#sepCarousel" data-bs-slide="prev">
                <i className="bi bi-chevron-left icon_prev"></i>
              </button>
              <button className="carousel-control-next" data-bs-target="#sepCarousel" data-bs-slide="next">
                <i className="bi bi-chevron-right icon_prev"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsCarousel;
