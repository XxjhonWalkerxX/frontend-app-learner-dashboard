import React, { useState, useEffect } from 'react';

// Datos mock para mostrar contenido de ejemplo
const mockDownloads = [
  {
    "id": "download-1",
    "titulo": "Matemáticas Básicas",
    "descripcion": "Fundamentos de álgebra y geometría",
    "instructor": "Prof. María González",
    "progreso": 85,
    "fechaDescarga": "2025-01-15",
    "duracion": "2:45:30",
    "nivel": "Principiante",
    "categoria": "Matemáticas",
    "portada": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop",
    "tamaño": "1.2 GB",
    "calificacion": 4.8,
    "activo": true
  },
  {
    "id": "download-2",
    "titulo": "Inglés Intermedio",
    "descripcion": "Conversación y gramática nivel B1",
    "instructor": "Prof. John Smith",
    "progreso": 72,
    "fechaDescarga": "2025-01-10",
    "duracion": "3:20:15",
    "nivel": "Intermedio",
    "categoria": "Idiomas",
    "portada": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    "tamaño": "2.1 GB",
    "calificacion": 4.9,
    "activo": true
  },
  {
    "id": "download-3",
    "titulo": "Historia de México",
    "descripcion": "Desde la época prehispánica hasta la actualidad",
    "instructor": "Prof. Ana Rodríguez",
    "progreso": 90,
    "fechaDescarga": "2025-01-08",
    "duracion": "4:15:45",
    "nivel": "Intermedio",
    "categoria": "Historia",
    "portada": "https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?w=400&h=250&fit=crop",
    "tamaño": "1.8 GB",
    "calificacion": 4.7,
    "activo": true
  },
  {
    "id": "download-4",
    "titulo": "Biología Celular",
    "descripcion": "Estructura y función de las células",
    "instructor": "Dr. Carlos López",
    "progreso": 65,
    "fechaDescarga": "2025-01-05",
    "duracion": "2:30:20",
    "nivel": "Avanzado",
    "categoria": "Ciencias",
    "portada": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop",
    "tamaño": "1.5 GB",
    "calificacion": 4.6,
    "activo": true
  },
  {
    "id": "download-5",
    "titulo": "Programación Python",
    "descripcion": "Introducción a la programación con Python",
    "instructor": "Ing. Laura Martínez",
    "progreso": 45,
    "fechaDescarga": "2025-01-03",
    "duracion": "5:10:30",
    "nivel": "Principiante",
    "categoria": "Tecnología",
    "portada": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    "tamaño": "2.8 GB",
    "calificacion": 4.9,
    "activo": true
  },
  {
    "id": "download-6",
    "titulo": "Química Orgánica",
    "descripcion": "Compuestos orgánicos y sus reacciones",
    "instructor": "Dr. Roberto Fernández",
    "progreso": 30,
    "fechaDescarga": "2025-01-01",
    "duracion": "3:45:15",
    "nivel": "Avanzado",
    "categoria": "Ciencias",
    "portada": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
    "tamaño": "2.2 GB",
    "calificacion": 4.5,
    "activo": true
  }
];

const DownloadsCarousel = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular carga de datos reales
      // En el futuro aquí se haría fetch a la API de downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Por ahora usar datos mock
      setDownloads(mockDownloads);
      
    } catch (error) {
      console.error('Error al cargar descargas:', error);
      setError(`Error al cargar descargas: ${error.message}`);
      // Si hay error, mostrar datos mock de todas formas
      setDownloads(mockDownloads);
    } finally {
      setLoading(false);
    }
  };

  const openDownload = (download) => {
    alert(`📚 Reproducir: ${download.titulo}\n\nInstructor: ${download.instructor}\nDuración: ${download.duracion}\nProgreso: ${download.progreso}%`);
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div 
              className="p-5"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="spinner-border text-primary mb-3" role="status" style={{ color: '#5a122c !important' }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mb-0" style={{ color: '#5a122c', fontWeight: '600' }}>
                Cargando tus descargas...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div 
              className="alert alert-warning"
              style={{
                background: 'rgba(255, 193, 7, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: '#5a122c'
              }}
            >
              <h4 className="alert-heading" style={{ color: '#5a122c' }}>
                <i className="bi bi-exclamation-triangle"></i> Aviso
              </h4>
              <p className="mb-3">{error}</p>
              <button 
                className="btn"
                style={{
                  background: 'rgba(90, 18, 44, 0.9)',
                  border: '1px solid rgba(90, 18, 44, 1)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '0.6rem 1.2rem',
                  fontWeight: '600'
                }}
                onClick={loadData}
              >
                <i className="bi bi-arrow-clockwise"></i> Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header de la sección */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 
              className="mb-0"
              style={{
                color: '#5a122c',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
              }}
            >
              My Downloads
            </h2>
            <span 
              className="badge"
              style={{
                background: 'linear-gradient(135deg, #5a122c, #8b1538)',
                color: 'white',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {downloads.length} contenidos
            </span>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="row g-4">
        {downloads.map((download) => (
          <div key={download.id} className="col-lg-4 col-md-6 col-sm-12">
            <div 
              className="card h-100"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onClick={() => openDownload(download)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div className="d-flex flex-column h-100">
                {/* Imagen */}
                <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    className="card-img-top" 
                    src={download.portada}
                    alt={download.titulo}
                    style={{ 
                      objectFit: 'cover', 
                      width: '100%',
                      height: '100%'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop';
                    }}
                  />
                  
                  {/* Overlay glassmorphism */}
                  <div 
                    className="position-absolute"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(90, 18, 44, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(90, 18, 44, 0.05) 100%)'
                    }}
                  />
                  
                  {/* Badge de progreso */}
                  <div 
                    className="position-absolute top-0 end-0 m-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '0.4rem 0.8rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div 
                        className="progress me-2"
                        style={{ 
                          width: '50px', 
                          height: '4px',
                          backgroundColor: 'rgba(90, 18, 44, 0.2)'
                        }}
                      >
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${download.progreso}%`,
                            backgroundColor: '#5a122c'
                          }}
                        />
                      </div>
                      <small style={{ color: '#5a122c', fontWeight: '600', fontSize: '0.7rem' }}>
                        {download.progreso}%
                      </small>
                    </div>
                  </div>
                  
                  {/* Badge de nivel */}
                  <span 
                    className="badge position-absolute top-0 start-0 m-2"
                    style={{
                      background: download.nivel === 'Principiante' 
                        ? 'linear-gradient(135deg, #28a745, #20c997)'
                        : download.nivel === 'Intermedio'
                        ? 'linear-gradient(135deg, #fd7e14, #e55d87)'
                        : 'linear-gradient(135deg, #dc3545, #6f42c1)',
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: '600'
                    }}
                  >
                    {download.nivel}
                  </span>
                  
                  {/* Icono de play */}
                  <div 
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i 
                      className="bi bi-play-fill text-white" 
                      style={{ fontSize: '1.8rem', marginLeft: '3px' }}
                    />
                  </div>
                </div>

                {/* Body */}
                <div 
                  className="card-body d-flex flex-column flex-grow-1 p-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                  }}
                >
                  {/* Título */}
                  <h5 
                    className="card-title fw-bold mb-2"
                    style={{ 
                      color: '#5a122c',
                      textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}
                  >
                    {download.titulo}
                  </h5>
                  
                  {/* Descripción */}
                  <p 
                    className="card-text mb-2 flex-grow-1"
                    style={{ 
                      color: '#8b1538',
                      fontSize: '0.9rem',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.4'
                    }}
                  >
                    {download.descripcion}
                  </p>
                  
                  {/* Info del instructor */}
                  <div className="mb-2">
                    <small 
                      style={{ 
                        color: '#8b1538',
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {download.instructor}
                    </small>
                  </div>
                  
                  {/* Footer con info adicional */}
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span 
                        className="badge"
                        style={{
                          background: 'rgba(90, 18, 44, 0.1)',
                          color: '#5a122c',
                          border: '1px solid rgba(90, 18, 44, 0.3)',
                          fontSize: '0.7rem'
                        }}
                      >
                        <i className="bi bi-clock me-1"></i>
                        {download.duracion}
                      </span>
                      <span 
                        className="badge"
                        style={{
                          background: 'rgba(90, 18, 44, 0.1)',
                          color: '#5a122c',
                          border: '1px solid rgba(90, 18, 44, 0.3)',
                          fontSize: '0.7rem'
                        }}
                      >
                        <i className="bi bi-hdd me-1"></i>
                        {download.tamaño}
                      </span>
                    </div>
                    
                    {/* Botón de acción */}
                    <button 
                      className="btn w-100"
                      style={{
                        background: 'rgba(90, 18, 44, 0.9)',
                        border: '1px solid rgba(90, 18, 44, 1)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '12px',
                        padding: '0.6rem 1.2rem',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(90, 18, 44, 1)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(90, 18, 44, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(90, 18, 44, 0.9)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="bi bi-play-circle me-2"></i>
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadsCarousel;
