import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Image } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import { baseAppUrl } from 'data/services/lms/urls';

import emptyCourseSVG from 'assets/empty-course.svg';
import { reduxHooks } from 'hooks';

import messages from './messages';
import './index.scss';

export const NoCoursesView = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  return (
    <div
      id="no-courses-content-view"
      className="d-flex align-items-center justify-content-center mb-4.5"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        margin: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        minHeight: '400px',
        flexDirection: 'column'
      }}
    >
      <Image 
        src={emptyCourseSVG} 
        alt={formatMessage(messages.bannerAlt)}
        style={{
          filter: 'brightness(1.2) saturate(1.1)',
          marginBottom: '2rem'
        }}
      />
      <h1
        style={{
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}
      >
        🎯 {formatMessage(messages.lookingForChallengePrompt)}
      </h1>
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          fontSize: '1.2rem',
          marginBottom: '2rem',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px'
        }}
      >
        {formatMessage(messages.exploreCoursesPrompt)}
      </p>
      <Button
        variant="brand"
        as="a"
        href={baseAppUrl(courseSearchUrl)}
        iconBefore={Search}
        style={{
          background: 'linear-gradient(135deg, rgba(177, 122, 42, 0.9), rgba(177, 122, 42, 1))',
          border: '1px solid rgba(177, 122, 42, 1)',
          color: 'white',
          borderRadius: '16px',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(177, 122, 42, 0.4)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px) scale(1.05)';
          e.target.style.boxShadow = '0 8px 25px rgba(177, 122, 42, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(177, 122, 42, 0.4)';
        }}
      >
        🚀 {formatMessage(messages.exploreCoursesButton)}
      </Button>
    </div>
  );
};

export default NoCoursesView;
