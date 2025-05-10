import api from './api';

/**
 * Sends user location data to the server
 * @param {Object} locationData - Object containing location information
 * @param {string} locationData.username - User's username
 * @param {number} locationData.latitude - Latitude coordinate
 * @param {number} locationData.longitude - Longitude coordinate
 * @param {number} locationData.altitude - Altitude (optional)
 * @param {number} locationData.accuracy - Location accuracy in meters (optional)
 * @param {string} locationData.name - Location name (optional)
 * @param {string} locationData.street - Street address (optional)
 * @param {string} locationData.district - District (optional)
 * @param {string} locationData.city - City name (optional)
 * @param {string} locationData.region - Region/State (optional)
 * @param {string} locationData.postal_code - Postal code (optional)
 * @param {string} locationData.country - Country (optional)
 * @param {string} locationData.formatted_address - Complete formatted address (optional)
 * @param {string} locationData.maps_url - URL to maps location (optional)
 * @param {string} locationData.timestamp - ISO timestamp of when location was recorded
 * @param {number} locationData.business_id - Business ID (optional)
 * @param {string} locationData.notes - Additional notes (optional)
 * @param {string} locationData.device_info - Device information (optional)
 * @param {boolean} locationData.is_check_in - Whether this is a check-in event (optional)
 * @param {string} locationData.shared_via - How the location was shared (optional)
 * @returns {Promise<Object>} The created location record
 */
export const sendLocation = async (locationData) => {
  try {
    const response = await api.post('/location/create', locationData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to send location data';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.detail || `Server responded with ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};