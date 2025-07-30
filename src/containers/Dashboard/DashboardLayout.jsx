import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Col } from '@openedx/paragon';
import bannerClassroom from 'assets/banner_classroom.jpg';
import avatarIcon from 'assets/avatar.svg';
import EMIlogo from 'assets/EMI_logo.png';
import './index.scss';

import { AppContext } from '@edx/frontend-platform/react';

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
  return (
    <div>
      <div
        className="dashboard-banner-bg"
        style={{ "--banner-bg-url": `url(${bannerClassroom})` }}
      >
      <img
        src={EMIlogo}
        alt="EMI Logo"
        className="dashboard-logo"
      />
        {authenticatedUser && (
          <div className="user-info-banner">
            <div className="user-info-content">
              <img src={avatarIcon} alt="Avatar" className="user-avatar" />
              <div className="user-name">{authenticatedUser.full_name || authenticatedUser.username}</div>
              <div className="user-email">{authenticatedUser.email}</div>
            </div>
          </div>
        )}
      </div>
      <Container fluid size="xl" className="dashboard-content-container">
        <Col {...columnConfig.courseList} className="course-list-column">
          {children}
        </Col>
      </Container>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;