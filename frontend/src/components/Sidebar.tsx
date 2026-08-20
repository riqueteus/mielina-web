import { Box, VStack, Flex, Text, Icon, Button } from "@chakra-ui/react"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { FaHouse, FaComment, FaRightFromBracket, FaChartLine, FaFileLines, FaFileMedical } from "react-icons/fa6"
import { supabase } from "../lib/supabase"
import mielinaLogoH from "../assets/mielina-logo.png"

interface MenuItem {
  path: string
  label: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  { path: "/dashboard", label: "Início", icon: FaHouse },
  { path: "/duvidas", label: "Dúvidas", icon: FaComment },
  { path: "/triagem", label: "Triagem", icon: FaChartLine },
  { path: "/resultados", label: "Resultados", icon: FaFileLines },
  { path: "/laudos", label: "Meus Laudos", icon: FaFileMedical }
]

interface SidebarProps {
  onNavigate?: () => void 
}

function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <Flex
      direction="column"
      w="64"
      className="bg-neurons"
      h="100vh"
      position="sticky"
      top="0"
      gap="4"
      overflowY="auto"
      borderRight="1px solid #e2e8f0"
    >
      <Flex align="center" p="6" justify="center">
        <img src={mielinaLogoH} alt="Mielina" className="w-44" />
      </Flex>

      <VStack align="stretch" gap="2" px="4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Flex
              key={item.path}
              asChild
              align="center"
              gap="3"
              px="3"
              py="2.5"
              borderRadius="lg"
              bg={isActive ? "white" : "transparent"}
              color={isActive ? "#7c3aed" : "#334155"}
              fontWeight={isActive ? "700" : "500"}
              boxShadow={isActive ? "0 1px 3px rgba(15,23,42,0.12)" : "none"}
              _hover={{
                bg: isActive ? "white" : "rgba(255,255,255,0.7)",
                color: "#7c3aed",
              }}
              transition="all 0.15s"
            >
              <RouterLink to={item.path} onClick={onNavigate}>
                <Icon as={item.icon} boxSize="5" />
                <Text fontSize="md">{item.label}</Text>
              </RouterLink>
            </Flex>
          )
        })}
      </VStack>

      <Box mt="auto" p="4">
        <Button
          onClick={handleLogout}
          w="full"
          bg="#7c3aed"
          color="white"
          _hover={{ bg: "#6d28d9", transform: "translateY(-1px)" }}
          size="lg"
          borderRadius="lg"
        >
          <Icon as={FaRightFromBracket} boxSize="5" />
          Sair
        </Button>
      </Box>
    </Flex>
  )
}

export default Sidebar