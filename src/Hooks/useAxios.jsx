import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://piirms.vercel.app'
})

const useAxios = () => {
    return axiosInstance
}

export default useAxios