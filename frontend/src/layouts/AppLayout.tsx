import { Flex, Box, IconButton, Drawer, Portal, useDisclosure } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { FaBars } from "react-icons/fa6"
import Sidebar from "../components/Sidebar"
import mielinaLogoH from "../assets/mielina-logo.png"

function AppLayout() {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Flex minH="100vh">
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      <Box flex="1" overflowY="auto" className="bg-gradient-mielina">
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
        >
          <IconButton aria-label="Abrir menu" onClick={onOpen} variant="ghost">
            <FaBars />
          </IconButton>
          <Flex align="center" p="6">
        <img src={mielinaLogoH} alt="Mielina" className="h-12" />
      </Flex>
        </Flex>

        <Outlet />
      </Box>

      <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="start">
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="64" w="64">
              <Sidebar onNavigate={onClose} />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  )
}

export default AppLayout