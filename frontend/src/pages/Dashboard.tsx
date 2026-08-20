import { Alert, Avatar, Box, Flex, Heading, Text, Stack, SimpleGrid, Icon } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { FaCommentDots, FaChartLine, FaFileMedical, FaFileLines, FaArrowRight } from "react-icons/fa6"
import { useAuth } from "../hooks/useAuth"

interface ResourceCard {
  icon: React.ElementType
  accentColor: string
  tintColor: string
  title: string
  description: string
  linkLabel: string
  path: string
}

const resources: ResourceCard[] = [
  {
    icon: FaCommentDots,
    accentColor: "#2563eb",
    tintColor: "rgba(37, 99, 235, 0.10)",
    title: "Dúvidas",
    description: "Tire suas dúvidas sobre Esclerose Múltipla.",
    linkLabel: "Perguntar agora",
    path: "/duvidas",
  },
  {
    icon: FaChartLine,
    accentColor: "#7c3aed",
    tintColor: "rgba(124, 58, 237, 0.10)",
    title: "Triagem (CIS)",
    description: "Responda o questionário e verifique possíveis indícios.",
    linkLabel: "Iniciar triagem",
    path: "/triagem",
  },
  {
    icon: FaFileMedical,
    accentColor: "#0d9488",
    tintColor: "rgba(13, 148, 136, 0.10)",
    title: "Meus Laudos",
    description: "Envie seus laudos de ressonância em PDF e acompanhe a evolução das lesões.",
    linkLabel: "Enviar laudo",
    path: "/laudos",
  },
  {
    icon: FaFileLines,
    accentColor: "#b45309",
    tintColor: "rgba(180, 83, 9, 0.10)",
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

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6" width="100%" className="lg:mt-5">
        {resources.map((resource) => (
          <Flex
            key={resource.path}
            direction="column"
            gap="4"
            p="6"
            borderRadius="20px"
            className="bg-neurons-soft"
            boxShadow="0 20px 45px -12px rgba(15, 23, 42, 0.35)"
            border="1px solid #e2e8f0"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-6px)",
              boxShadow: "0 30px 60px -15px rgba(15, 23, 42, 0.45)",
            }}
          >
            <Flex gap="3" align="center">
              <Flex
                align="center"
                justify="center"
                boxSize="12"
                borderRadius="14px"
                bg={resource.tintColor}
                color={resource.accentColor}
                flexShrink="0"
              >
                <Icon as={resource.icon} boxSize="6" />
              </Flex>
              <Text fontWeight="bold" fontSize="lg" color={resource.accentColor}>
                {resource.title}
              </Text>
            </Flex>

            <Text fontSize="sm" color="gray.600" flex="1" lineHeight="relaxed">
              {resource.description}
            </Text>

            <Flex
              asChild
              align="center"
              gap="1"
              color={resource.accentColor}
              fontWeight="600"
              fontSize="sm"
              _hover={{ color: "gray.700" }}
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