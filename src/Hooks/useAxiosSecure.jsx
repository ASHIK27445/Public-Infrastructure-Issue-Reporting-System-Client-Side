import axios from "axios";
import { AuthContext } from '../Pages/AuthProvider/AuthContext';
import { use, useEffect } from "react";
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
const useAxiosSecure = () => {
    const {user} = use(AuthContext)

    useEffect(()=>{
        const reqInterceptor = axiosSecure.interceptors.request.use(config=>{
            config.headers.authorization = `Bearer ${user?.accessToken}`
            return config
        })

        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // console.log(error);
                return Promise.reject(error);
            }
            );
        
        return ()=>{
            axiosSecure.interceptors.request.eject(reqInterceptor)
            axiosSecure.interceptors.response.eject(resInterceptor)
        }

    }, [user])

    return axiosSecure
}

export default useAxiosSecure