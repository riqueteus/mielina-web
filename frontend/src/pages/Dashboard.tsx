import { Alert, Avatar, Box, Flex, Heading, Text, Stack, SimpleGrid, Icon } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { FaCommentDots, FaChartLine, FaBrain, FaFileLines, FaArrowRight } from "react-icons/fa6"
import { useAuth } from "../hooks/useAuth"

interface ResourceCard {
  icon: React.ElementType
  backgroundColor: string
  title: string
  description: string
  linkLabel: string
  path: string
}

const resources: ResourceCard[] = [
  {
    icon: FaCommentDots,
    backgroundColor: "blue.300",
    title: "Dúvidas",
    description: "Tire suas dúvidas sobre Esclerose Múltipla.",
    linkLabel: "Perguntar agora",
    path: "/duvidas",
  },
  {
    icon: FaChartLine,
    backgroundColor: "purple.300",
    title: "Triagem (CIS)",
    description: "Responda o questionário e verifique possíveis indícios.",
    linkLabel: "Iniciar triagem",
    path: "/triagem",
  },
  {
    icon: FaBrain,
    backgroundColor: "teal.300",
    title: "Ressonância",
    description: "Envie suas imagens e receba uma análise inteligente.",
    linkLabel: "Enviar imagem",
    path: "/ressonancia",
  },
  {
    icon: FaFileLines,
    backgroundColor: "cyan.300",
    title: "Resultados",
    description: "Acompanhe seus resultados e análises anteriores.",
    linkLabel: "Ver histórico",
    path: "/resultados",
  },
]

function Dashboard() {
  const { session } = useAuth()

  const nomeCompleto = session?.user?.user_metadata?.full_name || "Usuário"
  const primeiroNome = nomeCompleto.split(" ")[0]
  const foto = session?.user?.user_metadata?.avatar_url

  return (
    <Stack gap="6" p="6" width="100%" className="lg:mt-14">

      <Flex align="center" gap="4">
        <Avatar.Root size="lg">
          <Avatar.Image src={foto} alt={nomeCompleto} />
          <Avatar.Fallback>{primeiroNome[0]}</Avatar.Fallback>
        </Avatar.Root>

        <Box>
          <Heading size="lg">Olá, {primeiroNome}! 👋</Heading>
          <Text color="gray.800">
            A Mielina está pronta para informar, analisar dados e apoiar a sua jornada com a Esclerose Múltipla.
          </Text>
        </Box>
      </Flex>

      <Box width="100%" className="lg:mt-5">
        <Alert.Root status="info">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Importante!</Alert.Title>
            <Alert.Description>
              A Mielina não substitui o acompanhamento médico. Sempre consulte seu profissional de saúde.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4" width="100%" className="lg:mt-5">
        {resources.map((resource) => (
          <Flex
            key={resource.path}
            direction="column"
            color="gray.800"
            gap="2"
            p="5"
            borderRadius="4xl"
            bg={resource.backgroundColor}
          >
            <Flex gap="5" align="center">
              <Icon as={resource.icon} boxSize="6" />
              <Text fontWeight="bold">{resource.title}</Text>
            </Flex>

            <Text fontSize="sm" color="gray.500" flex="1">
              {resource.description}
            </Text>

            <Flex
              asChild
              align="center"
              gap="1"
              color="purple.800"
              fontWeight="600"
              fontSize="sm"
              _hover={{ color: "teal.700" }}
            >
              <RouterLink to={resource.path}>
                {resource.linkLabel}
                <Icon as={FaArrowRight} boxSize="3" />
              </RouterLink>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>

    </Stack>
  )
}

export default Dashboard