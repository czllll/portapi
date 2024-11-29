import { authService } from "@/services/auth"
import { useState } from "react"
import axios from "@/lib/axios-config"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('注册失败')
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
            router.push('/dashboard')
            return true
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('登录失败')
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