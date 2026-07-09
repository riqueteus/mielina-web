import { Button, Text } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"
import { FaArrowRight, FaGoogle } from "react-icons/fa6"

interface GoogleLoginButtonProps extends ButtonProps {
  onClick?: () => void
}

const GoogleLoginButton = ({ onClick, ...props }: GoogleLoginButtonProps) => {
  return (
    <Button
      w="full"
      maxW="md"
      background="blue.500"
      color="white"
      px="8"
      py="7"
      borderRadius="2xl"
      fontSize="lg"
      fontWeight="600"
      onClick={onClick}
      _hover={{
        opacity: 0.9,
        transform: "translateY(-3px)",
        color: "gray.800",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      className="transition-all duration-200"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <FaGoogle size={30} />
      <Text fontSize="lg" fontWeight="bold">              
        Entrar com Google
      </Text>
      <FaArrowRight size={30} />
    </Button>
  )
}

export default GoogleLoginButton
