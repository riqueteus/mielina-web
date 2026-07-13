import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import Duvidas from "./pages/Duvidas"
import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import Triagem from "./pages/Triagem"
import Ressonancia from "./pages/Ressonancia"
import Resultados from "./pages/Resultados"

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
          <Route path="/duvidas" element={<Duvidas />} />
          <Route path="/triagem" element={<Triagem />} />
          <Route path="/ressonancia" element={<Ressonancia />} />
          <Route path="/resultados" element={<Resultados />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App