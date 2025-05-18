import api from "./api";

/**
 * Get manufacturing items
 * 
 * @param {number} zid - Business ID (path parameter)
 * @param {Object} params - Query parameters
 * @param {string} [params.search_text] - Search text to filter manufacturing items
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.size=10] - Number of items per page
 * @returns {Promise} - Promise resolving to the manufacturing items data
 */
export const get_manufacturing_items = async (zid, params = {}) => {
  try {
    const { search_text = '', page = 1, size = 10 } = params;
    
    const queryParams = {
      search_text,
      page,
      size
    };
    
    const response = await api.get(`/manufacturing/mo/${zid}`, {
      params: queryParams
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching manufacturing items:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get manufacturing item details by ID
 * 
 * @param {number} zid - Business ID
 * @param {string} moNumber - Manufacturing order number
 * @returns {Promise} - Promise resolving to the manufacturing item details
 */
export const get_manufacturing_item_details = async (zid, moNumber) => {
  try {
    const response = await api.get(`/manufacturing/mo-details/${zid}/${moNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching manufacturing item details:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new manufacturing order
 * 
 * @param {number} zid - Business ID
 * @param {Object} data - Manufacturing order data
 * @returns {Promise} - Promise resolving to the created manufacturing order
 */
export const create_manufacturing_order = async (zid, data) => {
  try {
    const response = await api.post(`/manufacturing/mo/${zid}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating manufacturing order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Export manufacturing order data
 * 
 * @param {number} zid - Business ID
 * @param {string} moNumber - Manufacturing order number
 * @param {boolean} [download=true] - Whether to download the exported file
 * @returns {Promise} - Promise resolving to the export URL or blob data
 */
export const export_manufacturing_order = async (zid, moNumber, download = true) => {
  try {
    // For direct download, we'll return the URL that can be opened in a browser
    if (download) {
      return `${api.defaults.baseURL}/manufacturing/mo-export/${zid}/${moNumber}?download=true`;
    }
    
    // If not downloading, fetch the data as a blob
    const response = await api.get(`/manufacturing/mo-export/${zid}/${moNumber}`, {
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting manufacturing order:", error.response?.data || error.message);
    throw error;
  }
};

// Export company ZID constants for convenience (same as in other API files)
export const COMPANY_ZIDS = {
  GI_CORP: '100000',
  HMBR: '100001',
  ZEPTO: '100005',
  PACKAGING: '100009'
};

export const COMPANY_NAMES = {
  '100000': 'GI Corp',
  '100001': 'HMBR',
  '100005': 'Zepto',
  '100009': 'Packaging'
};
