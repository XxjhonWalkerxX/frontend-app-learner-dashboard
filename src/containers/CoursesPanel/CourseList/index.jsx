import React from 'react';
import PropTypes from 'prop-types';

import { Pagination } from '@openedx/paragon';
import {
  ActiveCourseFilters,
} from 'containers/CourseFilterControls';
import CourseCard from 'containers/CourseCard';

import { useIsCollapsed } from './hooks';

export const CourseList = ({ courseListData }) => {
  const {
    filterOptions, setPageNumber, numPages, showFilters, visibleList,
  } = courseListData;
  const isCollapsed = useIsCollapsed();
  return (
    <>
      {showFilters && (
        <div 
          id="course-list-active-filters-container"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ActiveCourseFilters {...filterOptions} />
        </div>
      )}
      <div 
        className="d-flex flex-row flex-nowrap overflow-auto" 
        style={{
          gap: "1.5rem",
          padding: "1rem",
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}
      >
        {visibleList.map(({ cardId }) => (
          <CourseCard key={cardId} cardId={cardId} />
        ))}
      </div>
      {numPages > 1 && (
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          <Pagination
            variant={isCollapsed ? 'reduced' : 'secondary'}
            paginationLabel="Course List"
            className="mx-auto mb-2"
            pageCount={numPages}
            onPageSelect={setPageNumber}
            style={{
              '--bs-pagination-color': 'white',
              '--bs-pagination-bg': 'rgba(255, 255, 255, 0.1)',
              '--bs-pagination-border-color': 'rgba(255, 255, 255, 0.2)',
              '--bs-pagination-hover-color': 'white',
              '--bs-pagination-hover-bg': 'rgba(177, 122, 42, 0.8)',
              '--bs-pagination-hover-border-color': 'rgba(177, 122, 42, 1)',
              '--bs-pagination-active-color': 'white',
              '--bs-pagination-active-bg': 'rgba(177, 122, 42, 1)',
              '--bs-pagination-active-border-color': 'rgba(177, 122, 42, 1)'
            }}
          />
        </div>
      )}
    </>
  );
};

export const courseListDataShape = PropTypes.shape({
  showFilters: PropTypes.bool.isRequired,
  visibleList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filterOptions: PropTypes.shape().isRequired,
  numPages: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
});

CourseList.propTypes = {
  courseListData: courseListDataShape,
};

export default CourseList;
