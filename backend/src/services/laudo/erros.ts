export class ErroLaudo extends Error {
  constructor(
    public status: number,
    message: string,
    public detalhe?: unknown
  ) {
    super(message);
    this.name = 'ErroLaudo';
  }
}