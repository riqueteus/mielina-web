export interface StatusServico {
  nome: string;
  acordado: boolean;
  mensagem: string;
}

export interface PingResposta {
  servicos: StatusServico[];
  todosProntos: boolean;
}