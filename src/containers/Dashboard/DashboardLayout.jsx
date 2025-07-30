import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Col } from '@openedx/paragon';
import { AppContext } from '@edx/frontend-platform/react';

import bannerClassroom from 'assets/banner_classroom.jpg';
import avatarIcon from 'assets/avatar.svg';
import EMIlogo from 'assets/EMI_logo.png';
import './index.scss';

export const columnConfig = {
  courseList: {
    xs: { span: 12, offset: 0 },
    sm: { span: 12, offset: 0 },
    md: { span: 12, offset: 0 },
    lg: { span: 12, offset: 0 },
    xl: { span: 12, offset: 0 },
  },
};

export const DashboardLayout = ({ children }) => {
  const { authenticatedUser } = useContext(AppContext) || {};
  const [activeTab, setActiveTab] = useState('my-courses');

  const tabs = [
    { id: 'my-courses', label: 'My Courses' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
  ];

  return (
    <div>
      <div
        className="dashboard-banner-bg"
        style={{ '--banner-bg-url': `url(${bannerClassroom})` }}
      >
        <img src={EMIlogo} alt="EMI Logo" className="dashboard-logo" />

        {authenticatedUser && (
          <div className="user-info-banner">
            <div className="user-info-content">
              <img
                src={avatarIcon}
                alt="Avatar"
                className="user-avatar"
              />
              <div className="user-text">
                <div className="user-name">
                  {authenticatedUser.full_name || authenticatedUser.username}
                </div>
                <div className="user-email">{authenticatedUser.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Container fluid size="xl" className="dashboard-content-container">
        {/* TABS DE NAVEGACIÓN */}
        <nav className="dashboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`dashboard-tab ${
                activeTab === tab.id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CONTENIDO SEGÚN TAB ACTIVA */}
        {activeTab === 'my-courses' ? (
          <Col {...columnConfig.courseList} className="course-list-column">
            {children}
          </Col>
        ) : (
          <div className="dashboard-placeholder">
            <p>Esta sección («{tabs.find(t => t.id === activeTab).label}») estará disponible pronto.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
