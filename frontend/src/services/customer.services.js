import { DEFAULT_AVATAR } from '@/constants';
/***
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
    throw new Error(json.message);
  }
  return json.data;
}

function makeCustomerServices() {
  const baseURL = '/api/v1/customers';
  async function fetchCustomers(page, limit = 10) {
    let url = `${baseURL}?page=${page}&limit=${limit}`;
    const data = await efetch(url);

    data.customers = data.customers.map((customer) => {
      customer.avatar = customer.avatar || DEFAULT_AVATAR;
      return customer;
    });
    return data;
  }

  async function fetchCustomerById(id) {
    const url = `${baseURL}/${id}`;
    const customer = await efetch(url);
    customer.avatar = customer.avatar || DEFAULT_AVATAR;
    return customer;
  }

  async function createCustomer(customer) {
    return efetch(baseURL, {
      method: 'POST',
      body: customer
    });
  }
  async function deleteCustomer(id) {
    return efetch(`${baseURL}/${id}`, {
      method: 'DELETE'
    });
  }
  async function updateCustomer(id, customer) {
    return efetch(`${baseURL}/${id}`, {
      method: 'PUT',
      body: customer
    });
  }
  return {
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    deleteCustomer,
    updateCustomer
  };
}
export default makeCustomerServices();
