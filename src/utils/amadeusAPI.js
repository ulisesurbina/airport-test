import axios from 'axios';
import qs from 'qs';

const AMADEUS_API_URL = 'https://test.api.amadeus.com';
const API_KEY = 'WypRBGXA4p6jti1m6MsSACMX9yNLsP5A';
const API_SECRET = '2z3ryjDyFvenq4Vx';

let accessToken = null;
let tokenExpiration = null;

  const formatDateTime = (date) => {
    return date.toLocaleString('es-ES', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
  };

  const getAccessToken = async () => {
    try {
      if (!accessToken || !tokenExpiration || new Date() >= tokenExpiration) {
        const storedToken = localStorage.getItem('accessToken');
        const storedExpiration = localStorage.getItem('tokenExpiration');
        if (storedToken && storedExpiration && new Date() < new Date(storedExpiration)) {
          accessToken = storedToken;
          tokenExpiration = new Date(storedExpiration);
          console.log('Token cargado de localStorage válido hasta:', formatDateTime(tokenExpiration));
          return accessToken;
        }

      let data = qs.stringify({ 
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };

        const response = await axios.request(config);
        accessToken = response.data.access_token;
        let timeExpired = response.data.expires_in * 1000;

        const currentDate = new Date();
        tokenExpiration = new Date(currentDate.getTime() + timeExpired);
        // console.log('Token nuevo generado.');
        // console.log('Hora actual:', formatDateTime(currentDate));
        // console.log('Token expira:', formatDateTime(tokenExpiration));
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('tokenExpiration', tokenExpiration.toISOString());
        return accessToken;
      }
    } catch (error) {
        console.error('Error al obtener el token:', error);
        throw error;
    }
  };

  export const expiredTimeToken = async () => {
    await getAccessToken();
    const dateTokenInfo = `${formatDateTime(tokenExpiration)}`;
      // localStorage.setItem('tokenExpiration', dateTokenInfo);
    return dateTokenInfo;
  }
  
  export const searchLocations = async (keyword) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(`${AMADEUS_API_URL}/v1/reference-data/locations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                keyword,
                subType: 'AIRPORT,CITY',
            },
        });
        return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      console.error('Error fetching locations:', errorMessage);
      if (error.response?.status === 401) {
        accessToken = null;
        tokenExpiration = null;
        return searchLocations(keyword);
      }
      throw new Error(errorMessage);
    }
};

