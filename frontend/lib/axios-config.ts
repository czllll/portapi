import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  (config) => {
    // 每次请求时都从 localStorage 获取最新的 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        toast.error('登录状态已过期，请重新登录')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

export default axiosInstance
