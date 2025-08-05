/**
 * Validates meeting link URLs for online appointments
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateMeetingLink = (url) => {
  if (!url) return true; // Empty URL is allowed
  
  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check for common meeting platforms
  const allowedDomains = [
    'meet.google.com',
    'zoom.us',
    'teams.microsoft.com',
    'webex.com',
    'gotomeeting.com',
    'discord.gg',
    'discord.com',
    'skype.com'
  ];
  
  const urlObj = new URL(url);
  return allowedDomains.some(domain => urlObj.hostname.includes(domain));
};

/**
 * Get error message for invalid meeting link
 * @param {string} url - The URL that failed validation
 * @returns {string} - Error message
 */
export const getMeetingLinkErrorMessage = (url) => {
  if (!url) return '';
  
  try {
    new URL(url);
  } catch {
    return 'URL không hợp lệ. Vui lòng nhập đúng format URL.';
  }
  
  return 'Link không được hỗ trợ. Vui lòng sử dụng Google Meet, Zoom, Teams, Webex, GoToMeeting, Discord hoặc Skype.';
};

/**
 * Get supported platforms list
 * @returns {string[]} - Array of supported platform names
 */
export const getSupportedPlatforms = () => [
  'Google Meet',
  'Zoom',
  'Microsoft Teams',
  'Webex',
  'GoToMeeting',
  'Discord',
  'Skype'
];

/**
 * Example URLs for different platforms
 */
export const exampleUrls = {
  googleMeet: 'https://meet.google.com/fkb-kdsd-bgu',
  zoom: 'https://zoom.us/j/1234567890',
  teams: 'https://teams.microsoft.com/l/meetup-join/...',
  webex: 'https://webex.com/meet/example',
  discord: 'https://discord.gg/example',
  skype: 'https://join.skype.com/example'
};
