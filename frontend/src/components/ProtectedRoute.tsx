import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Spinner } from "@chakra-ui/react"

interface ProtectedRouteProps {
    children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { session, loading } = useAuth()

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <Spinner color="purple.500" size="lg" />
    </div>
    if (!session) return <Navigate to="/" replace />

    return <>{children}</>
}

export default ProtectedRoute