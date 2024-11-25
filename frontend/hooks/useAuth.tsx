import { authService } from "@/services/auth"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface RegisterFormData {
    username: string
    email: string
    password: string
}

interface LoginFormData {
    email: string
    password: string
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const handleRegister = async(formData: RegisterFormData) => {
        setIsLoading(true)
        try {
            await authService.register(formData)
            router.push('/login')
            return true
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || '注册失败')
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async(formData: LoginFormData) => {  
        setIsLoading(true)
        try {
            await authService.login(formData)
            router.push('/')
            return true
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || '登录失败')
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }

    
    return {
        isLoading,
        error,
        handleRegister,
        handleLogin,
    }
}