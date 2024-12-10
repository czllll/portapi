import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useUserStore from "@/stores/useUserStore"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const {user} = useUserStore()

  useEffect(() => {
    const authCheck = async () => {
      if (!user) {
        setAuthorized(false)
        router.push("/auth/login")
        return
        
      }

      if (adminOnly && user.role !== "admin") {
        setAuthorized(false)
        router.push("/403") 
      } else {
        setAuthorized(true)
      }
    }

    authCheck()
  }, [adminOnly, router, user])


  return authorized ? <>{children}</> : null
}

export default ProtectedRoute