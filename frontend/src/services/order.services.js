/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options) {
  let result = [];
  let json = [];
  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

function makeCartServices() {
  const baseURL = '/api/v1/cart';

  // Fetch order by ID
  async function fetchOrderById(orderId) {
    const url = `${baseURL}/${orderId}`;
    return efetch(url);
  }


  async function createOrder(customerId, orderData) {
    const url = `${baseURL}/customers/${customerId}`; 
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const locationHeader = response.headers.get('Location');
    const orderId = locationHeader.split('/').pop();

    return orderId; 
  }


  // Update an existing order
  async function updateOrder(orderId, orderData) {
    const url = `${baseURL}/${orderId}`;
    return efetch(url, {
      method: 'PUT',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Delete an order detail by order ID and product ID
  async function deleteOrderDetail(orderId, productId) {
    const url = `${baseURL}/${orderId}/details/${productId}`;
    return efetch(url, {
      method: 'DELETE'
    });
  }

  // Fetch order details by order ID
  async function fetchOrderDetails(orderId) {
    const url = `${baseURL}/${orderId}/details`;
    return efetch(url);
  }

  // Create a new order detail
  async function createOrderDetail(orderId, productId, detailData) {
    const url = `${baseURL}/${orderId}/details/${productId}`;
    return efetch(url, {
      method: 'POST',
      body: JSON.stringify(detailData),  // Chuyển đối tượng orderData thành chuỗi JSON
      headers: {
        'Content-Type': 'application/json',  // Đảm bảo yêu cầu gửi dữ liệu JSON
      },
    });
  }

  // Update an existing order detail
  async function updateOrderDetail(orderId, productId, detailData) {
    const url = `${baseURL}/${orderId}/details/${productId}`;
    return efetch(url, {
      method: 'PUT',
      body: JSON.stringify(detailData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return {
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrderDetail,
    fetchOrderDetails,
    createOrderDetail,
    updateOrderDetail
  };
}

export default makeCartServices();
