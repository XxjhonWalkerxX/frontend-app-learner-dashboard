import { useKeyedState, StrictDict } from '@edx/react-unit-test-utils';

import track from 'tracking';
import { reduxHooks } from 'hooks';

export const stateKeys = StrictDict({
  isEmailSettingsVisible: 'isEmailSettingsVisible',
});

export const useEmailSettings = () => {
  const [isVisible, setIsVisible] = useKeyedState(stateKeys.isEmailSettingsVisible, false);
  return {
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    isVisible,
  };
};

export const useHandleToggleDropdown = (cardId) => {
  const trackCourseEvent = reduxHooks.useTrackCourseEvent(
    track.course.courseOptionsDropdownClicked,
    cardId,
  );
  return (isOpen) => {
    if (isOpen) { trackCourseEvent(); }
  };
};

export const useOptionVisibility = (cardId) => {
  const { isEmailEnabled } = reduxHooks.useCardEnrollmentData(cardId);
  const { twitter, facebook } = reduxHooks.useCardSocialSettingsData(cardId);

  const shouldShowDropdown = (
    isEmailEnabled
    || facebook.isEnabled
    || twitter.isEnabled
  );

  return {
    shouldShowDropdown,
  };
};
