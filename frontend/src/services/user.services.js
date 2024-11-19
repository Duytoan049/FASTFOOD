import { DEFAULT_AVATAR } from '@/constants';

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
    throw new Error(json.message);
  }
  return json.data;
}

function makeUserServices() {
  const baseURL = '/api/v1/users';

  async function createUser(user) {
    return efetch(baseURL + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Đảm bảo gửi dữ liệu dưới dạng JSON
      },
      body: JSON.stringify(user) // Chuyển đổi object thành JSON string
    });
  }

  async function loginUser(user) {
    if (!user.username || !user.password) {
      throw new Error('Username and password are required');
    }

    const userData = {
      username: user.username,
      password: user.password
    };

    return efetch(`${baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  }

  return {
    createUser,
    loginUser
  };
}

export default makeUserServices();
