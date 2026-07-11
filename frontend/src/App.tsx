import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import Duvidas from "./pages/Duvidas"
import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/duvidas" element={<Duvidas  />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App