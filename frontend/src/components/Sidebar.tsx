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
      shadow-2xl
      bg="gray.100"
      h="100vh"
      position="sticky"
      top="0"
      gap="10"
    >
      <Flex align="center" p="10" justify="center">
        <img src={mielinaLogoH} alt="Mielina" className="w-60" />
      </Flex>

      <VStack align="stretch" gap="5" px="3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Flex
              key={item.path}
              asChild
              align="center"
              gap="3"
              px="3"
              py="2"
              borderRadius="lg"
              bg={isActive ? "teal.300" : "blue.800"}
              color={isActive ? "blue.700" : "gray.100"}
              fontWeight={isActive ? "600" : "400"}
              _hover={{ bg: "blue.300", color: "blue.700" }}
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

      <Box mt="auto" p="12">
        <Button
          onClick={handleLogout}
          w="full"
          bg="blue.800"
          color="white"
          _hover={{ bg: "purple.600" }}
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