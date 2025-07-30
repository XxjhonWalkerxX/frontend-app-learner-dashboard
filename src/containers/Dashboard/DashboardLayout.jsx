import React from 'react';
import PropTypes from 'prop-types';

import { Container, Col, Row } from '@openedx/paragon';

import WidgetSidebarSlot from 'plugin-slots/WidgetSidebarSlot';

import hooks from './hooks';

// Siempre ocupar 12 columnas
export const columnConfig = {
  courseList: {
    lg: { span: 12, offset: 0 },
    xl: { span: 12, offset: 0 },
  },
};

export const DashboardLayout = ({ children }) => {
  // Ya no se necesita lógica de sidebar
  return (
    <Container fluid size="xl">
      <Row>
        <Col {...columnConfig.courseList} className="course-list-column">
          {children}
        </Col>
      </Row>
    </Container>
  );
};
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
