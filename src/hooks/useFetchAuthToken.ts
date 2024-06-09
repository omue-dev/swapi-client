import axios from 'axios';

let tokenTimeout: NodeJS.Timeout;

const getAuthToken = async (username: string, password: string) => {
  try {
    const response = await axios.post('https://www.weltenbummler-erkelenz.de/api/oauth/token', {
      client_id: 'administration',
      grant_type: 'password',
      scopes: 'read',
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, expires_in } = response.data;

    // Setze einen Timeout, um das Token zu erneuern, bevor es abläuft
    if (tokenTimeout) {
      clearTimeout(tokenTimeout);
    }
    tokenTimeout = setTimeout(() => {
      getAuthToken(username, password);
    }, (expires_in - 60) * 1000); // Erneuern 1 Minute vor Ablauf

    return access_token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    throw error;
  }
};
export default getAuthToken;