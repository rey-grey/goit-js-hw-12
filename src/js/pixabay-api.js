import axios from 'axios';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export async function getImagesByQuery(query, page) {
    const API_KEY = '50194034-6daf74b2774d983dcc54e4495';
    const BASE_URL = 'https://pixabay.com/api/';
    const PER_PAGE = 15;

    const params = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page: PER_PAGE
        
    };
    try {
        const response = await axios.get(BASE_URL, { params });
        return response.data;
    }
    catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Illegal operation',
        });
        return [];
    }
}


