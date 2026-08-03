export type Mensagem = {
  id: number;
  tipo: 'usuario' | 'ia' | 'sistema';
  texto: string;
  fontes?: string[];
};

export type RespostaErro = {
  erro?: string;
  cold_start?: boolean;
  tentativas?: number;
};

export type StatusRag = 'verificando' | 'pronto' | 'acordando' | 'indisponivel';

export type ResultadoPergunta = {
  sucesso: boolean;
  erro?: string;
  cold_start?: boolean;
  resposta?: string;
  fontes?: string[];
};

export type RespostaRAG = {
  resposta?: string;
  fontes?: string[];
};
