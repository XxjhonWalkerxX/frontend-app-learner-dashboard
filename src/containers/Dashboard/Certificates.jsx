import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import './index.scss';

const API_BASE = 'https://emi.aprende.gob.mx';
const mockCerts = [
  {
    course_id: "course-v1:EMI+TEST+2025",
    course_display_name: "Curso de Prueba",
    course_organization: "EMI",
    certificate_type: "final",
    created_date: new Date().toISOString(),
    download_url: "/static/certificados/ejemplo.pdf",
    status: "downloadable",
    grade: "9.20"
  },
  {
    course_id: "course-v1:EMI+TEST+2025",
    course_display_name: "Curso de Prueba",
    course_organization: "EMI",
    certificate_type: "final",
    created_date: new Date().toISOString(),
    download_url: "/static/certificados/ejemplo.pdf",
    status: "downloadable",
    grade: "9.20"
  },
  {
    course_id: "course-v1:EMI+TEST+2025",
    course_display_name: "Curso de Prueba",
    course_organization: "EMI",
    certificate_type: "final",
    created_date: new Date().toISOString(),
    download_url: "/static/certificados/ejemplo.pdf",
    status: "downloadable",
    grade: "9.20"
  },
  {
    course_id: "course-v1:EMI+TEST+2025",
    course_display_name: "Curso de Prueba",
    course_organization: "EMI",
    certificate_type: "final",
    created_date: new Date().toISOString(),
    download_url: "/static/certificados/ejemplo.pdf",
    status: "downloadable",
    grade: "9.20"
  },
  {
    course_id: "course-v1:EMI+TEST+2025",
    course_display_name: "Curso de Prueba",
    course_organization: "EMI",
    certificate_type: "final",
    created_date: new Date().toISOString(),
    download_url: "/static/certificados/ejemplo.pdf",
    status: "downloadable",
    grade: "9.20"
  }
];

const Certificates = () => {
  const { authenticatedUser } = useContext(AppContext) || {};
  const username = authenticatedUser?.username;
  const [certs, setCerts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!username) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch(
          `${API_BASE}/api/certificates/v0/certificates/${username}/`,
          {
            credentials: 'include',
            headers: { Accept: 'application/json' },
          }
        );
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        // const data = await resp.json();
        setCerts(mockCerts);  // reemplaza mockCerts por data cuando funcione
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) {
    return (
      <div className="fondo_verde_oscuro mt-5 p-4 text-center text-white">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Obtaining certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fondo_verde_oscuro mt-5 p-4">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!certs.length) {
    return (
      <div className="fondo_verde_oscuro mt-5 p-4 text-white">
        <p>No certificates available</p>
      </div>
    );
  }

  return (
    <div className="fondo_verde_oscuro mt-5 p-4">
      <div
        id="certCarousel"
        className="carousel carousel-dark slide"
        data-bs-interval="false"
        data-bs-wrap="false"
      >
        <div className="carousel-inner">
          {certs.map((cert, i) => {
            const fecha = new Date(cert.created_date).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const downloadLink = `${API_BASE}${cert.download_url}`;
            return (
              <div
                key={cert.course_id + i}
                className={`carousel-item${i === 0 ? ' active' : ''}`}
              >
                <div className="d-flex justify-content-center">
                  <div className="card bg-dark text-white" style={{ width: '20rem' }}>
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
                        <strong>Grade:</strong> {cert.grade}
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
              </div>
            );
          })}
        </div>

        {certs.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#certCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;
