import { Box, VStack, Flex, Text, Icon, Button } from "@chakra-ui/react"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { FaHouse, FaComment, FaRightFromBracket, FaChartLine, FaBrain, FaFileLines } from "react-icons/fa6"
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
  { path: "/ressonancia", label: "Ressonância", icon: FaBrain },
  { path: "/resultados", label: "Resultados", icon: FaFileLines }
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
      bg="cyan.600"
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
              bg={isActive ? "purple.50" : "transparent"}
              color={isActive ? "purple.700" : "gray.100"}
              fontWeight={isActive ? "600" : "400"}
              _hover={{ bg: "purple.50", color: "purple.700" }}
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
          bg="purple.700"
          color="white"
          _hover={{ bg: "blue.500" }}
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