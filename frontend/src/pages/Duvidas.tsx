import { Box, VStack, Text, HStack, Icon } from "@chakra-ui/react"
import { FiMessageCircle } from "react-icons/fi"
import Chatbot from "../components/Chatbot"
import { useAuth } from "../hooks/useAuth"

function Duvidas() {
  const { session } = useAuth()
  const userId = session?.user?.id

  return (
    <Box p={{ base: "4", md: "8" }} minH="100vh">
      <VStack gap="6" align="stretch" maxW="5xl" mx="auto">
        <Box>
          <HStack gap="3" mb="2">
            <Icon as={FiMessageCircle} boxSize="8" color="purple.700" />
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              color="purple.700"
              fontWeight="bold"
            >
              Tire suas dúvidas!
            </Text>
          </HStack>
        </Box>

        {userId && <Chatbot userId={userId} />}
      </VStack>
    </Box>
  )
}

export default Duvidas