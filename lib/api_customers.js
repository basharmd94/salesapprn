import api from './api';

export const searchCustomers = async (zid, searchText, employeeId, limit = 10, offset = 0) => {
  try {
    const response = await api.get(
      `/customers/all/${zid}?customer=${searchText}&employee_id=${employeeId}&limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // Return empty array for no results
    }
    console.error('Error searching customers:', error);
    throw error;
  }
};

export const syncCustomersRequest = async (employeeId, limit = 100, offset = 0) => {
  try {
    const response = await api.get(
      `/customers/all-sync?employee_id=${employeeId}&limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // Return empty array when we reach the end of data
    }
    throw error; // Let the sync function handle other errors
  }
};