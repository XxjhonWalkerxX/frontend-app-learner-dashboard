// Certificates.jsx
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
    status: "downloadable"
  }
];

const Certificates = () => {
  const { authenticatedUser } = useContext(AppContext) || {};
  const username = authenticatedUser?.username;
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }
    const fetchCerts = async () => {
      try {
        const resp = await fetch(
          `${API_BASE}/api/certificates/v0/certificates/${username}/`,
          { 
            credentials: 'include',
            headers: { Accept: 'application/json' },
          }
        );
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        const data = await resp.json();
        // Si no hay certificados, usa los de prueba
        if (!data.length) {
            data = mockCerts;
        }
        setCerts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [username]);

  // Spinner / Loading
  if (loading) {
    return (
      <div className="fondo_verde_oscuro mt-5 p-4 text-center text-white">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Obteniendo certificados...</p>
      </div>
    );
  }

  // Error
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

  // Sin certificados
  if (!certs.length) {
    return (
      <div className="fondo_verde_oscuro mt-5 p-4 text-white">
        <p>No tienes certificados disponibles.</p>
      </div>
    );
  }

  // Lista de certificados
  return (
    <div className="fondo_verde_oscuro mt-5 p-4">
      <div className="row gy-4">
        {certs.map(cert => {
          const fecha = new Date(cert.created_date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const downloadLink = `${API_BASE}${cert.download_url}`;
          return (
            <div key={cert.course_id} className="col-md-4">
              <div className="card bg-dark text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">{cert.course_display_name}</h5>
                  <p className="card-text mb-1">
                    <strong>Institución:</strong> {cert.course_organization}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Tipo:</strong> {cert.certificate_type}
                  </p>
                  <p className="card-text">
                    <strong>Emitido:</strong> {fecha}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  {cert.status === 'downloadable' ? (
                    <a
                      href={downloadLink}
                      className="btn btn-outline-light"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-download me-1 icon_download"></i>
                      Descargar
                    </a>
                  ) : (
                    <span className="badge bg-secondary">No disponible</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Certificates;
