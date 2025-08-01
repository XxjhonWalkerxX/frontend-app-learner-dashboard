// DownloadsCarousel.jsx
import React, { useEffect, useState } from 'react';
import './index.scss';

const API_URL =
  'https://nemd.aprende.gob.mx/api/estructura/alineador/?format=json&nivel=bachillerato-general&raiz=emi';

// Helper: divide un array en “chunks” de tamaño N
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

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
        <div className="col-md-12 fondo_verde_oscuro mt-5">
          <div
            id="sepCarousel"
            className="carousel carousel-dark slide"
            data-bs-interval="false"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="d-flex">
                  {displayLevels.map((lvl,i) => {
                    const imgSrc = lvl.portada || '/static/images/default-course.jpg';
                    return (
                      <div key={i} className="flex-shrink-0 me-3">
                        <div
                          className="card bg-dark text-white h-100 position-relative"
                          onClick={() => openLevel(lvl.slug)}
                        >
                          <img
                            src={imgSrc}
                            alt={lvl.nombre_completo}
                            className="card-img"
                            onError={e => e.currentTarget.src = '/static/images/default-course.jpg'}
                            loading="lazy"
                          />
                          <div className="card-img-overlay d-flex flex-column justify-content-end">
                            <h5 className="fw-bold">{lvl.tipo.nombre}: {lvl.nombre}</h5>
                            <p className="mb-1">{lvl.nivel.nombre}</p>
                            <p className="mb-1">{lvl.raiz.nombre}</p>
                            <div className="mt-2 text-end">
                              {lvl.activo
                                ? <span className="badge bg-success me-1">Activo</span>
                                : <span className="badge bg-secondary me-1">Inactivo</span>}
                              {lvl.suscrito
                                ? <span className="badge bg-primary"><i className="bi bi-check-circle me-1" />Suscrito</span>
                                : <span className="badge bg-outline-light"><i className="bi bi-plus-circle me-1" />Suscribirse</span>}
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
              className="carousel-control-prev"
              type="button"
              data-bs-target="#sepCarousel"
              data-bs-slide="prev"
            >
              <i className="bi bi-chevron-left"></i>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#sepCarousel"
              data-bs-slide="next"
            >
              <i className="bi bi-chevron-right"></i>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadsCarousel;
