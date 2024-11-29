import { authService } from "@/services/auth"
import { useState } from "react"
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

interface User {
    userId: number;
    username: string;
    email: string;
    token: string;
    avatar: string | null;
    role: string;
    status: string | null;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, ] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const router = useRouter()
    const handleRegister = async(formData: RegisterFormData) => {
        setIsLoading(true)
        try {
            const response = await authService.register(formData)
            if (response.code !== 200) {
                throw new Error(response.message)
            }
            toast.success('注册成功，请登录')
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
            await fetchCurrentUser()
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

    // 获取当前登录用户信息
    const fetchCurrentUser = async () => {
        setIsLoading(true)
        try {
            const user = await authService.getCurrentUser()
            setCurrentUser(user)
            return user
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const checkAdmin = () => {
        return currentUser?.role.toLowerCase() === 'admin'
    }
    
    return {
        isLoading,
        error,
        currentUser,
        handleRegister,
        handleLogin,
        fetchCurrentUser,
        checkAdmin
    }
}
