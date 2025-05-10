import api from './api';

export const createBulkOrder = async (orders) => {
  try {
    // Format the orders array into the expected schema
    const payload = {
      orders: orders.map(order => ({
        zid: order.zid,
        xcus: order.xcus,
        xcusname: order.xcusname,
        xcusadd: order.xcusadd,
        items: order.items.map(item => ({
          xitem: item.xitem,
          xdesc: item.xdesc,
          xqty: item.xqty,
          xprice: item.xprice,
          xroword: item.xroword,
          xdate: item.xdate,
          xsl: item.xsl,
          xlat: item.xlat,
          xlong: item.xlong,
          xlinetotal: item.xlinetotal
        }))
      }))
    };

    // Ensure we're sending JSON data
    const response = await api.post('/order/create-bulk-order', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSingleOrder = async (order) => {
  return createBulkOrder([order]); // Reuse bulk order function with single order
};

export const getPendingOrders = async () => {
  try {
    const response = await api.get('/order/get-pending-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfirmedOrders = async () => {
  try {
    const response = await api.get('/order/get-confirmed-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCancelledOrders = async () => {
  try {
    const response = await api.get('/order/get-cancelled-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getYearlyStats = async (year) => {
  try {
    const response = await api.get(`/order/yearly-stats${year ? `?year=${year}` : ''}`);  // Updated path
    return response.data;
  } catch (error) {
    throw error;
  }
};