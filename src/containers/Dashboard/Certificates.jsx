import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import './CertificatesComponent.scss';

const CertificatesComponent = () => {
  const { authenticatedUser } = useContext(AppContext) || {};
  const username = authenticatedUser?.username;
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`https://emi.aprende.gob.mx/api/certificates/v0/certificates/${username}/`,
          { credentials: 'include', headers: { Accept: 'application/json' } }
        );
        if (!response.ok) {
          throw new Error('Error al obtener los certificados');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [username]);

  if (loading) return <div className="loading">Cargando certificados...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGrade = (grade) => {
    return `${Math.round(parseFloat(grade) * 100)}%`;
  };

  return (
    <div className="certificates-container">
      <h2>Mis Certificados</h2>
      
      {certificates.length === 0 ? (
        <div className="no-certificates">
          No tienes certificados disponibles.
        </div>
      ) : (
        <div className="certificates-list">
          {certificates.map((certificate, index) => (
            <div key={index} className="certificate-card">
              <div className="certificate-thumbnail">
                <div className="certificate-icon">
                  <i className="fas fa-certificate"></i>
                </div>
              </div>
              
              <div className="certificate-info">
                <h3>{certificate.course_display_name}</h3>
                
                <div className="certificate-details">
                  <div className="institution">
                    <span>Institución: </span>
                    <span>{certificate.course_organization}</span>
                  </div>
                  
                  <div className="date">
                    <span>Fecha de obtención: </span>
                    <span>{formatDate(certificate.created_date)}</span>
                  </div>
                  
                  <div className="grade">
                    <span>Calificación: </span>
                    <span>{formatGrade(certificate.grade)}</span>
                  </div>
                </div>
                
                <div className="certificate-actions">
                  <a 
                    href={`https://emi.aprende.gob.mx${certificate.download_url}`} 
                    className="download-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar Certificado
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesComponent;