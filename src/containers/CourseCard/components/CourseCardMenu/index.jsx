import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Dropdown, Icon, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';

import EmailSettingsModal from 'containers/EmailSettingsModal';
import { reduxHooks } from 'hooks';
import SocialShareMenu from './SocialShareMenu';
import {
  useEmailSettings,
  useHandleToggleDropdown,
  useOptionVisibility,
} from './hooks';

import messages from './messages';

export const CourseCardMenu = ({ cardId }) => {
  const { formatMessage } = useIntl();

  const emailSettings = useEmailSettings();
  const handleToggleDropdown = useHandleToggleDropdown(cardId);
  const { shouldShowDropdown } = useOptionVisibility(cardId);
  const { isEmailEnabled } = reduxHooks.useCardEnrollmentData(cardId);

  if (!shouldShowDropdown) {
    return null;
  }

  return (
    <>
      <Dropdown onToggle={handleToggleDropdown}>
        <Dropdown.Toggle
          id={`course-actions-dropdown-${cardId}`}
          as={IconButton}
          src={MoreVert}
          iconAs={Icon}
          variant="primary"
          alt={formatMessage(messages.dropdownAlt)}
        />
        <Dropdown.Menu>
          <SocialShareMenu cardId={cardId} emailSettings={emailSettings} />
        </Dropdown.Menu>
      </Dropdown>
      {isEmailEnabled && (
        <EmailSettingsModal
          show={emailSettings.isVisible}
          closeModal={emailSettings.hide}
          cardId={cardId}
        />
      )}
    </>
  );
};
CourseCardMenu.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardMenu;
