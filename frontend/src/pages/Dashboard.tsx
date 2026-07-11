import { Button } from "@chakra-ui/react"
import { supabase } from "../lib/supabase"
import mielinaLogoH from "../assets/mielina-logo.png"
import { Text } from "@chakra-ui/react"


function Dashboard() {

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen w-full bg-gradient-mielina flex flex-col overflow-y-auto">
      <header className="flex items-center justify-center shadow-sm h-32">
                <div className="w-3/4 h-24 flex items-center justify-center ">
                    <img
                        src={mielinaLogoH}
                        alt="Mielina Logo"
                        className="w-full h-auto max-h-full object-contain"
                    />
                </div>
            </header>

      <main className="flex items-center justify-center flex-col flex-1">
        <div className="max-w-7xl mx-auto py-6 ">
          <div className="px-8 py-8">
          <Text className="text-2xl text-gray-700" fontWeight="bold">
            Bem-vindo a Mielina!
          </Text>
          </div>
        </div>
        <Button onClick={handleLogout} size="xl" fontSize="lg" className="bg-purple-500 hover:bg-blue-500 text-white py-2 px-4">
          Sair
        </Button>
      </main>
    </div>
  )
}

export default Dashboard