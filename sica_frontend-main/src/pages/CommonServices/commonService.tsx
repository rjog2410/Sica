import axios from 'axios';
// import useAuthStore from '@/store/authStore';

// const token = useAuthStore.getState().token;
const { protocol, hostname, port } = window.location;
// URL base de la API para columnas
// const API_URL_COLUMNAS = 'http://localhost:8080/catalogos/columnas';
const API_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;



export const getInfoPantalla = async (url: string, token : string | null) => {
    try {
        const response = await axios.post(`${API_URL}/session/getInfoUrl`, { url }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        // console.log(response);
        return response?.data?.message;
    } catch (error) {
        // console.error('Error fetching columnas from API:', error);
        throw error;
    }
};