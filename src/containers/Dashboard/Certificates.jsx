// Certificates.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import './index.scss';

// Bootstrap carousel initialization
const initBootstrapCarousel = () => {
  if (typeof window !== 'undefined' && window.bootstrap) {
    const carouselElement = document.querySelector('#certCarousel');
    if (carouselElement) {
      return new window.bootstrap.Carousel(carouselElement, {
        interval: false,
        wrap: true
      });
    }
  }
};

const API_BASE = 'https://emi.aprende.gob.mx';
const mockCerts = [
  {
    course_id: "course-v1:EMI+MATEMATICAS+2025_T1",
    course_display_name: "Matemáticas para Bachillerato",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    certificate_type: "verified",
    created_date: "2025-01-15T10:30:00Z",
    download_url: "/static/certificados/matematicas_bachillerato.pdf",
    status: "downloadable",
    grade: "95"
  },
  {
    course_id: "course-v1:EMI+INGLES_A2+2024_T4",
    course_display_name: "Inglés Nivel A2 - Elemental",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    certificate_type: "honor",
    created_date: "2024-12-20T14:45:00Z",
    download_url: "/static/certificados/ingles_a2.pdf",
    status: "downloadable",
    grade: "88"
  },
  {
    course_id: "course-v1:EMI+CIENCIAS+2024_T3",
    course_display_name: "Ciencias Naturales - Biología",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    certificate_type: "verified",
    created_date: "2024-11-10T09:15:00Z",
    download_url: "/static/certificados/ciencias_biologia.pdf",
    status: "downloadable",
    grade: "92"
  },
  {
    course_id: "course-v1:EMI+HISTORIA+2024_T2",
    course_display_name: "Historia de México",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    certificate_type: "verified",
    created_date: "2024-08-30T16:20:00Z",
    download_url: "/static/certificados/historia_mexico.pdf",
    status: "downloadable",
    grade: "87"
  },
  {
    course_id: "course-v1:EMI+PROGRAMACION+2024_T1",
    course_display_name: "Introducción a la Programación",
    course_organization: "EMI - Escuela Mexicana de Inglés",
    certificate_type: "honor",
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
  const [certs, setCerts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

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
        // const data = await resp.json();
        setCerts(mockCerts);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  // Initialize Bootstrap carousel after component mounts and certificates are loaded
  useEffect(() => {
    if (!loading && certs.length > 0) {
      const timer = setTimeout(() => {
        initBootstrapCarousel();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, certs]);

  if (loading) return (
    <div className="fondo_verde_oscuro mt-5 p-4 text-center text-white">
      <div className="spinner-border text-light" role="status"></div>
      <p className="mt-2">Obtaining certificates...</p>
    </div>
  );

  if (error) return (
    <div className="fondo_verde_oscuro mt-5 p-4">
      <div className="alert alert-danger mb-0">
        <i className="bi bi-exclamation-triangle-fill me-1"></i>{error}
      </div>
    </div>
  );

  if (!certs.length) return (
    <div className="fondo_verde_oscuro mt-5 p-4 text-white">
      <p>No certificates available</p>
    </div>
  );

  // Divide en grupos según el tamaño de pantalla
  // Desktop: 4 por slide, Tablet: 2 por slide, Mobile: 1 por slide
  const getCardsPerSlide = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1200) return 4; // xl
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // sm y menor
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide);

  useEffect(() => {
    const handleResize = () => setCardsPerSlide(getCardsPerSlide());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = chunkArray(certs, cardsPerSlide);

  return (
    <div className="fondo_verde_oscuro mt-5 p-4">
      <div
        id="certCarousel"
        className="carousel slide"
        data-bs-ride="false"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          {slides.map((group, idx) => (
            <div
              key={idx}
              className={`carousel-item${idx === 0 ? ' active' : ''}`}
            >
              <div className="row gy-4 justify-content-center">
                {group.map((cert, i) => {
                  const fecha = new Date(cert.created_date)
                    .toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
                  const downloadLink = `${API_BASE}${cert.download_url}`;
                  const colClass = cardsPerSlide === 1 ? 'col-12' : 
                                  cardsPerSlide === 2 ? 'col-12 col-md-6' : 
                                  'col-12 col-md-6 col-xl-3';
                  return (
                    <div
                      key={cert.course_id + i}
                      className={colClass}
                    >
                      <div className="card bg-dark text-white h-100">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{cert.course_display_name}</h5>
                          <p className="card-text mb-1">
                            <strong>Organization:</strong> {cert.course_organization}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Type:</strong> {cert.certificate_type}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Date:</strong> {fecha}
                          </p>
                          <p className="card-text mb-3">
                            <strong>Grade:</strong> {cert.grade}%
                          </p>
                          <div className="mt-auto text-center">
                            {cert.status === 'downloadable' ? (
                              <a
                                href={downloadLink}
                                className="btn btn-outline-light w-100"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-download me-1 icon_download"></i>
                                Download
                              </a>
                            ) : (
                              <span className="badge bg-secondary">No available</span>
                            )}
                          </div>
                        </div>
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
              className="carousel-control-prev"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="prev"
              aria-label="Previous"
            >
              <i className="bi bi-chevron-left" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="next"
              aria-label="Next"
            >
              <i className="bi bi-chevron-right" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;
