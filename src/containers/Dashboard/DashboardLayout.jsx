import React from 'react';
import PropTypes from 'prop-types';
import { Container, Col } from '@openedx/paragon';
import bannerClassroom from 'assets/banner_classroom.jpg';
import './index.scss';

export const columnConfig = {
  courseList: {
    lg: { span: 12, offset: 0 },
    xl: { span: 12, offset: 0 },
  },
};

export const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div
        className="dashboard-banner-bg"
        style={{ backgroundImage: `url(${bannerClassroom})` }}
      />
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