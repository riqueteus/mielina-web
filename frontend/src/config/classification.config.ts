import type { ChaveCampo } from "../types/classification.types";

export interface OpcaoResposta {
  valor: number;
  rotulo: string;
  descricao?: string;
}

export interface CampoPergunta {
  campo: ChaveCampo;
  pergunta: string;
  ajuda?: string;
  tipo: "opcao" | "numero";
  opcoes?: OpcaoResposta[];
  minimo?: number;
  maximo?: number;
  unidade?: string;
  rotuloNumero?: string;
}

export interface EtapaTriagem {
  titulo: string;
  descricao: string;
  campos: CampoPergunta[];
}

const SINTOMAS_INICIAIS: OpcaoResposta[] = [
  { valor: 1, rotulo: "Visual", descricao: "Ex.: visão borrada ou perda de visão em um olho" },
  { valor: 2, rotulo: "Sensorial", descricao: "Ex.: formigamento, dormência ou queimação" },
  { valor: 3, rotulo: "Motor", descricao: "Ex.: fraqueza ou falta de coordenação" },
  { valor: 4, rotulo: "Outros" },
  { valor: 5, rotulo: "Visual e sensorial" },
  { valor: 6, rotulo: "Visual e motor" },
  { valor: 7, rotulo: "Visual e outros" },
  { valor: 8, rotulo: "Sensorial e motor" },
  { valor: 9, rotulo: "Sensorial e outros" },
  { valor: 10, rotulo: "Motor e outros" },
  { valor: 11, rotulo: "Visual, sensorial e motor" },
  { valor: 12, rotulo: "Visual, sensorial e outros" },
  { valor: 13, rotulo: "Visual, motor e outros" },
  { valor: 14, rotulo: "Sensorial, motor e outros" },
  { valor: 15, rotulo: "Visual, sensorial, motor e outros" },
];

export const ETAPAS_TRIAGEM: EtapaTriagem[] = [
  {
    titulo: "Sobre você",
    descricao: "Conte um pouco sobre seu perfil e histórico de saúde.",
    campos: [
      {
        campo: "Gender",
        pergunta: "Qual é o seu sexo biológico?",
        tipo: "opcao",
        opcoes: [
          { valor: 1, rotulo: "Masculino" },
          { valor: 2, rotulo: "Feminino" },
        ],
      },
      {
        campo: "Age",
        pergunta: "Qual é a sua idade?",
        tipo: "numero",
        minimo: 0,
        maximo: 120,
        unidade: "anos",
        rotuloNumero: "Digite sua idade",
      },
      {
        campo: "Schooling",
        pergunta: "Quantos anos de estudo você concluiu?",
        ajuda: "Ex.: ensino fundamental completo = 9 anos; ensino médio completo = 12 anos.",
        tipo: "numero",
        minimo: 0,
        maximo: 30,
        unidade: "anos",
        rotuloNumero: "Ex.: 12",
      },
      {
        campo: "Breastfeeding",
        pergunta: "Você foi amamentado(a) quando bebê?",
        tipo: "opcao",
        opcoes: [
          { valor: 1, rotulo: "Sim" },
          { valor: 2, rotulo: "Não" },
          { valor: 3, rotulo: "Não sei" },
        ],
      },
      {
        campo: "Varicella",
        pergunta: "Você já teve catapora (varicela)?",
        tipo: "opcao",
        opcoes: [
          { valor: 1, rotulo: "Sim, já tive" },
          { valor: 2, rotulo: "Não" },
          { valor: 3, rotulo: "Não sei" },
        ],
      },
    ],
  },
  {
    titulo: "Sintomas iniciais",
    descricao: "Pense nos sintomas que você apresentou no início.",
    campos: [
      {
        campo: "Initial_Symptom",
        pergunta: "Qual foi o(s) primeiro(s) sintoma(s) que você apresentou?",
        ajuda: "Se você teve mais de um sintoma, escolha a opção que descreve a combinação.",
        tipo: "opcao",
        opcoes: SINTOMAS_INICIAIS,
      },
      {
        campo: "Mono_or_Polysymptomatic",
        pergunta: "Como foram seus sintomas na apresentação inicial?",
        tipo: "opcao",
        opcoes: [
          { valor: 1, rotulo: "Monossintomático", descricao: "Um único sintoma" },
          { valor: 2, rotulo: "Polissintomático", descricao: "Vários sintomas ao mesmo tempo" },
          { valor: 3, rotulo: "Não sei" },
        ],
      },
    ],
  },
  {
    titulo: "Exames e laboratório",
    descricao: "Informe os resultados de exames que você já realizou.",
    campos: [
      {
        campo: "Oligoclonal_Bands",
        pergunta: "Bandas oligoclonais no líquido cefalorraquidiano (LCR)?",
        ajuda: "Exame do liquor coletado por punção lombar.",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Negativo", descricao: "Não foram encontradas" },
          { valor: 1, rotulo: "Positivo", descricao: "Foram encontradas" },
        ],
      },
      {
        campo: "LLSSEP",
        pergunta: "Potencial evocado somatossensorial dos membros inferiores (LLSSEP)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Normal", descricao: "Sem alterações" },
          { valor: 1, rotulo: "Alterado", descricao: "Com alterações" },
        ],
      },
      {
        campo: "ULSSEP",
        pergunta: "Potencial evocado somatossensorial dos membros superiores (ULSSEP)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Normal", descricao: "Sem alterações" },
          { valor: 1, rotulo: "Alterado", descricao: "Com alterações" },
        ],
      },
      {
        campo: "VEP",
        pergunta: "Potencial evocado visual (VEP)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Normal", descricao: "Sem alterações" },
          { valor: 1, rotulo: "Alterado", descricao: "Com alterações" },
        ],
      },
      {
        campo: "BAEP",
        pergunta: "Potencial evocado auditivo do tronco encefálico (BAEP)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Normal", descricao: "Sem alterações" },
          { valor: 1, rotulo: "Alterado", descricao: "Com alterações" },
        ],
      },
    ],
  },
  {
    titulo: "Ressonância magnética",
    descricao: "Informe os achados da sua ressonância magnética, se você já realizou.",
    campos: [
      {
        campo: "Periventricular_MRI",
        pergunta: "Há lesões periventriculares no cérebro?",
        ajuda: "Lesões próximas aos ventrículos cerebrais.",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Não", descricao: "Sem lesões" },
          { valor: 1, rotulo: "Sim", descricao: "Com lesões" },
        ],
      },
      {
        campo: "Cortical_MRI",
        pergunta: "Há lesões corticais (na camada externa do cérebro)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Não", descricao: "Sem lesões" },
          { valor: 1, rotulo: "Sim", descricao: "Com lesões" },
        ],
      },
      {
        campo: "Infratentorial_MRI",
        pergunta: "Há lesões infratentoriais (tronco encefálico e cerebelo)?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Não", descricao: "Sem lesões" },
          { valor: 1, rotulo: "Sim", descricao: "Com lesões" },
        ],
      },
      {
        campo: "Spinal_Cord_MRI",
        pergunta: "Há lesões na medula espinhal?",
        tipo: "opcao",
        opcoes: [
          { valor: 0, rotulo: "Não", descricao: "Sem lesões" },
          { valor: 1, rotulo: "Sim", descricao: "Com lesões" },
        ],
      },
    ],
  },
];

export const AVISO_TRIAGEM = {
  titulo: "Antes de começar",
  descricao:
    "Este questionário é uma ferramenta informativa que estima a possibilidade de evolução para Esclerose Múltipla com base em padrões de pacientes semelhantes. Ele é gratuito, leva cerca de 2 minutos e possui 4 etapas.",
  pontos: [
    "Os resultados são apenas uma estimativa e NÃO configuram diagnóstico médico.",
    "Este questionário não substitui a orientação, o diagnóstico ou o tratamento de um profissional de saúde.",
    "Se você apresentar sintomas, procure um médico ou neurologista o quanto antes.",
  ],
  botao: "Entendi, quero continuar",
} as const;

export const LIMIARES_RISCO = {
  moderado: 40,
  alto: 70,
} as const;

export const MENSAGEM_IA_ACORDANDO =
  "A primeira análise pode levar até 1 minuto enquanto o serviço de IA desperta.";