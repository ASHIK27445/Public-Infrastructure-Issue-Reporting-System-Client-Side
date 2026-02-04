import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_FIREBASE_HOSTING_URL
})
//http://localhost:3000
const useAxios = () => {
    return axiosInstance
}

export default useAxios