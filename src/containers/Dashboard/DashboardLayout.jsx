import React from 'react';
import PropTypes from 'prop-types';
import { Container, Col } from '@openedx/paragon';
import bannerClassroom from 'assets/banner_classroom.jpg';

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
        style={{
          width: '100%',
          height: '220px', 
          backgroundImage: `url(${bannerClassroom})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px)', 
        }}
      />
      <Container fluid size="xl" style={{ marginTop: '-120px', position: 'relative', zIndex: 1 }}>
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