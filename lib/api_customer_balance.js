import api from './api';
import API_CONFIG from './config';

/**
 * Fetches customer balance details for a specific customer within a date range
 * @param {string} customer - Customer ID
 * @param {string} frm_date - Start date in YYYY-MM-DD format
 * @param {string} to_date - End date in YYYY-MM-DD format
 * @param {number} zid - Business ZID
 * @returns {Promise<Object>} - Customer balance data including ledger entries
 */
export const getCustomerBalance = async (customer, frm_date, to_date, zid) => {
  try {
    const response = await api.post(
      'customer-balance/customer-balance/',
      {
        customer,
        frm_date,
        to_date,
        zid
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching customer balance:', error);
    
    let errorMessage = 'Failed to fetch customer balance';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.detail || `Server responded with ${error.response.status}`;
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please check your connection.';
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
      console.error('Error message:', error.message);
    }
    
    throw new Error(errorMessage);
  }
};