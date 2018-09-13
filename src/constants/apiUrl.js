import axios from 'axios'
const apiUrl = '/api/v2/';


const apiConnector = axios.create({
    baseURL: apiUrl,
    params: {
        format: 'json'
    },
    timeout:30000,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: "X-CSRFToken"
});

export default apiConnector