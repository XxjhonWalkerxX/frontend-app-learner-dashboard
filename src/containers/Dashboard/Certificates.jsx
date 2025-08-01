// Certificates.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import './index.scss';

const API_BASE = 'https://emi.aprende.gob.mx';
const mockCerts = [
  {
    course_id: "course-v1:EMI+MATEMATICAS+2025_T1",
    course_display_name: "Matemáticas para Bachillerato",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    created_date: "2025-01-15T10:30:00Z",
    download_url: "/static/certificados/matematicas_bachillerato.pdf",
    status: "downloadable",
    grade: "95"
  },
  {
    course_id: "course-v1:EMI+INGLES_A2+2024_T4",
    course_display_name: "Inglés Nivel A2 - Elemental",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    created_date: "2024-12-20T14:45:00Z",
    download_url: "/static/certificados/ingles_a2.pdf",
    status: "downloadable",
    grade: "88"
  },
  {
    course_id: "course-v1:EMI+CIENCIAS+2024_T3",
    course_display_name: "Ciencias Naturales - Biología",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    created_date: "2024-11-10T09:15:00Z",
    download_url: "/static/certificados/ciencias_biologia.pdf",
    status: "downloadable",
    grade: "92"
  },
  {
    course_id: "course-v1:EMI+HISTORIA+2024_T2",
    course_display_name: "Historia de México",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    created_date: "2024-08-30T16:20:00Z",
    download_url: "/static/certificados/historia_mexico.pdf",
    status: "downloadable",
    grade: "87"
  },
  {
    course_id: "course-v1:EMI+PROGRAMACION+2024_T1",
    course_display_name: "Introducción a la Programación",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    created_date: "2024-05-25T11:00:00Z",
    download_url: "/static/certificados/programacion_intro.pdf",
    status: "downloadable",
    grade: "96"
  }
];

// Helper para dividir en grupos de N
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Certificates = () => {
  const { authenticatedUser } = useContext(AppContext) || {};
  const username = authenticatedUser?.username;
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('Usuario no autenticado');
      return setLoading(false);
    }
    (async () => {
      try {
        const resp = await fetch(
          `${API_BASE}/api/certificates/v0/certificates/${username}/`,
          { credentials: 'include', headers: { Accept: 'application/json' } }
        );
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        const data = await resp.json();
        //si no hay certificados, usar mock
        if (!data.length) {
          setCerts(mockCerts);
        } else {
          setCerts(data);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) return (
    <div className="certificates-container">
      <div className="certificates-loading glass-morphism">
        <div className="spinner-border text-light" role="status"></div>
        <p className="mt-3">Obteniendo certificados...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="certificates-container">
      <div className="certificates-error glass-morphism">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
      </div>
    </div>
  );

  if (!certs.length) return (
    <div className="certificates-container">
      <div className="certificates-empty glass-morphism">
        <div className="empty-icon">📜</div>
        <p>No hay certificados disponibles</p>
      </div>
    </div>
  );

  // Divide en grupos de 3 para mejor visualización
  const slides = chunkArray(certs, 3);

  return (
    <div className="certificates-container">
      <div className="certificates-header glass-morphism mb-4">
        <h2 className="certificates-title">
          <span className="title-icon">🏆</span>
          Mis Certificados
        </h2>
        <p className="certificates-subtitle">
          Descarga y comparte tus logros académicos
        </p>
      </div>

      <div
        id="certCarousel"
        className="certificates-carousel"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          {slides.map((group, idx) => (
            <div
              key={idx}
              className={`carousel-item${idx === 0 ? ' active' : ''}`}
            >
              <div className="certificates-grid">
                {group.map((cert, i) => {
                  const fecha = new Date(cert.created_date)
                    .toLocaleDateString('es-MX', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  const downloadLink = `${API_BASE}${cert.download_url}`;
                  
                  return (
                    <div
                      key={cert.course_id + i}
                      className="certificate-card glass-morphism"
                    >
                      <div className="certificate-header">
                        <div className="certificate-icon">📜</div>
                        <div className="certificate-grade">
                          <span className="grade-number">{cert.grade}</span>
                          <span className="grade-symbol">%</span>
                        </div>
                      </div>
                      
                      <div className="certificate-content">
                        <h3 className="certificate-title">{cert.course_display_name}</h3>
                        
                        <div className="certificate-details">
                          <div className="detail-item">
                            <span className="detail-icon">🏛️</span>
                            <span className="detail-text">{cert.course_organization}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">{fecha}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="certificate-actions">
                        {cert.status === 'downloadable' ? (
                          <a
                            href={downloadLink}
                            className="download-btn glass-button"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="btn-icon">⬇️</span>
                            <span className="btn-text">Descargar</span>
                          </a>
                        ) : (
                          <div className="status-badge unavailable">
                            <span>No disponible</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {slides.length > 1 && (
          <>
            <button
              className="carousel-control carousel-control-prev"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="prev"
            >
              <div className="control-icon glass-button">‹</div>
            </button>
            <button
              className="carousel-control carousel-control-next"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="next"
            >
              <div className="control-icon glass-button">›</div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;
