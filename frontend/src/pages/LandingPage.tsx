import { Heading, Stack, Text } from "@chakra-ui/react"
import { FaBrain, FaChartLine, FaCommentDots } from "react-icons/fa6"
import GoogleLoginButton from "../components/GoogleLoginButton"
import bainhaHome from "../assets/bainha-home.png"
import mielinaLogoH from "../assets/mielina-logo.png"

interface ResourceItem {
    icon: React.ReactNode
    title: string
    description: string
    iconBg: string
}

const LandingPage = () => {
    const resources: ResourceItem[] = [
        {
            icon: <FaCommentDots />,
            title: "Tire dúvidas sobre Esclerose Múltipla",
            description: "Respostas claras e confiáveis geradas por IA treinada em fontes médicas.",
            iconBg: "bg-blue-100",
        },
        {
            icon: <FaChartLine />,
            title: "Questionário de triagem (CIS)",
            description: "Responda um questionário e descubra se você apresenta indícios de desenvolver Esclerose Múltipla.",
            iconBg: "bg-purple-100",
        },
        {
            icon: <FaBrain />,
            title: "Análise de Ressonância Magnética",
            description: "Envie suas imagens de ressonância e receba uma análise inteligente com apoio de IA.",
            iconBg: "bg-blue-100",
        },
    ]

    return (
        <div className="min-h-screen w-full bg-gradient-mielina flex flex-col overflow-y-auto">
            <header className="flex items-center justify-center shadow-sm h-32">
                <div className="w-3/4 h-24 flex items-center justify-center ">
                    <img
                        src={mielinaLogoH}
                        alt="Mielina Logo"
                        className="w-full h-auto max-h-full object-contain"
                    />
                </div>
            </header>


            <main className="flex-1 flex items-center justify-center h-4/5">
                <div className="w-3/4 h-5/6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Column */}
                        <div className="flex flex-col justify-center gap-8 lg:gap-10">
                            {/* Title */}
                            <div className="space-y-4">
                                <Heading as="h1" size="2xl" className="text-gray-900 leading-tight" fontWeight="bold">
                                    Informação e inteligência para entender e enfrentar a{" "}
                                    <span className="text-purple-600">Esclerose Múltipla</span>.
                                </Heading>
                            </div>

                            <Stack gap="9">
                                {resources.map((resource, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className={`${resource.iconBg} rounded-lg p-3 flex items-center justify-center text-lg text-gray-700 h-12 w-12`}>
                                            {resource.icon}
                                        </div>
                                        <div className="flex-1">
                                            <Text fontSize="md" fontWeight="bold" className="text-gray-900 mb-1">
                                                {resource.title}
                                            </Text>
                                            <Text fontSize="md" color="gray.500" className="leading-relaxed">
                                                {resource.description}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                            </Stack>

                            <div className="pt-2">
                                <GoogleLoginButton />
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={bainhaHome}
                                    alt="Bainha de Mielina"
                                    className="max-h-full max-w-full scale-125"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LandingPage
