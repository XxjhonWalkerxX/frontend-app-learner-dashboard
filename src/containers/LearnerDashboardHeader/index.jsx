import React from 'react';

import { AppContext } from '@edx/frontend-platform/react';
import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';

import './index.scss';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });

  return (
    <>
    <iframe
      srcdoc='
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <link href="https://framework-gb.cdn.gob.mx/assets/styles/main.css" rel="stylesheet">
            <style>
              footer, .footer { display: none !important; }
            </style>
          </head>
          <body>
            <div id="gobmx-content"></div>
            <script src="https://framework-gb.cdn.gob.mx/gobmx.js"></script>
          </body>
        </html>
      '
      style="width:100%;height:120px;border:none;"
    ></iframe>
      <ConfirmEmailBanner />
      <Header
        mainMenuItems={learnerHomeHeaderMenu.mainMenu}
        secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
        userMenuItems={learnerHomeHeaderMenu.userMenu}
      />
      <iframe
      srcdoc='
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <link href="https://framework-gb.cdn.gob.mx/assets/styles/main.css" rel="stylesheet">
            <style>
              .navbar { display: none !important; }
            </style>
          </head>
          <body>
            <div id="gobmx-content"></div>
            <script src="https://framework-gb.cdn.gob.mx/gobmx.js"></script>
          </body>
        </html>
      '
      style="width:100%;height:200px;border:none;"
    ></iframe>
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
