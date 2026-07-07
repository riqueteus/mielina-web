import { Button, Heading, Stack } from "@chakra-ui/react"
import { FaGoogle } from "react-icons/fa6"

function App() {
  return (
    <>
      <Stack direction="column" align="center" justify="center" minH="100vh" gap="20">
        <Heading as="h1" size="2xl" fontWeight="bold" color="blue.800">
          Bem vindo ao Mielina!
        </Heading>
        <Button background={"purple.800"} size="lg" _hover={{ background: "blue.800" }}>
          <span style={{ display: "inline-flex", marginRight: "8px" }}>
            <FaGoogle />
          </span>
          Entrar com o Google
        </Button>
      </Stack>
    </>
  )
}

export default App
