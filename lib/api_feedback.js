import api from "./api";

/**
 * Get customer feedback 
 * 
 * @param {string} customerId - ID of the customer to get feedback for
 * @param {number} zid - Business ID
 * @returns {Promise} - Promise resolving to the feedback data
 */
export const getCustomerFeedback = async (customerId, zid) => {
  try {
    const response = await api.get(`/feedback/customer/${customerId}`, {
      params: { zid }
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating feedback:", error.response?.data || error.message);
    throw error;
  }
};