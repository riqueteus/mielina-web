const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatadorHora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return `${formatadorData.format(data)} às ${formatadorHora.format(data)}`;
}

export function formatarDataSimples(iso: string | null): string {
  return iso ? iso.split("-").reverse().join("/") : "Data não identificada";
}