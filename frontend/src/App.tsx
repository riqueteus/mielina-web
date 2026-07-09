import { useAuth } from "./hooks/useAuth"
import LoggedPage from "./pages/LoggedPage"
import LandingPage from "./pages/LandingPage"
import { Spinner } from "@chakra-ui/react"

function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">   
      <Spinner color="purple.500" size="lg" />
      </div>
    )
  }

  return session ? <LoggedPage /> : <LandingPage />
}

export default App