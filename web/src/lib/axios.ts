import axios from 'axios'

const api = axios.create({
    baseURL: "https://habits-api.onrender.com/"
})

export default api