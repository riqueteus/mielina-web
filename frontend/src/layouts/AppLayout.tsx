import { Flex, Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function AppLayout() {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" overflowY="auto" className="bg-gradient-mielina">
        <Outlet />
      </Box>
    </Flex>
  )
}

export default AppLayout