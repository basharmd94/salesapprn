import api from "./api";

/**
 * Get all feedback
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.zid - Business ID
 * @param {string} [params.customer_id] - Customer ID to filter by
 * @param {string} [params.product_id] - Product ID to filter by
 * @param {boolean} [params.is_delivery_issue] - Filter by delivery issues
 * @param {boolean} [params.is_collection_issue] - Filter by collection issues
 * @param {number} [params.limit=50] - Number of records to retrieve
 * @param {number} [params.offset=0] - Pagination offset
 * @returns {Promise} - Promise resolving to the feedback data
 */
export const getAllFeedback = async (params) => {
  try {
    const response = await api.get('/feedback/', {
      params: params
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get customer feedback 
 * 
 * @param {string} customerId - ID of the customer to get feedback for
 * @param {number} zid - Business ID
 * @param {Object} [options] - Additional query options
 * @param {string} [options.product_id] - Product ID to filter by
 * @param {boolean} [options.is_delivery_issue] - Filter by delivery issues
 * @param {boolean} [options.is_collection_issue] - Filter by collection issues
 * @param {number} [options.limit=50] - Number of records to retrieve
 * @param {number} [options.offset=0] - Pagination offset
 * @returns {Promise} - Promise resolving to the feedback data
 */
export const getCustomerFeedback = async (customerId, zid, options = {}) => {
  try {
    const params = {
      customer_id: customerId,
      zid,
      ...options
    };
    
    const response = await api.get('/feedback/', {
      params: params
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new feedback entry
 * 
 * @param {Object} params - The feedback data
 * @param {string} params.customer_id - Customer ID associated with the feedback
 * @param {string} params.description - Detailed feedback description
 * @param {boolean} params.is_collection_issue - Whether there's a collection issue
 * @param {boolean} params.is_delivery_issue - Whether there's a delivery issue
 * @param {string} params.product_id - Product ID associated with the feedback (optional)
 * @param {string} params.user_id - User ID associated with the feedback
 * @param {number} params.zid - Business ID
 * @returns {Promise} - Promise resolving to the created feedback
 */
export const createFeedback = async (params) => {
  try {
    // The api instance already handles authorization in its interceptors
    const response = await api.post('/feedback/create', params);
    return response.data;
  } catch (error) {
    throw error;
  }
};