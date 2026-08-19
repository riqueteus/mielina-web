import type { Lesao, RegiaoCanonica } from '../../types/laudo.types';

const MAPA_REGIOES: Array<{ chave: RegiaoCanonica; padroes: RegExp[] }> = [
  {
    chave: 'periventricular',
    padroes: [/periventricular/i, /pericalos/i, /pericallos/i],
  },
  {
    chave: 'justacortical',
    padroes: [/justacortical/i, /justa.cortical/i, /subcortical/i, /cortical/i],
  },
  {
    chave: 'infratentorial',
    padroes: [
      /infratentorial/i,
      /cerebelar/i,
      /cerebelo/i,
      /fossa posterior/i,
      /ped[úu]nculo/i,
      /tronco cerebral/i,
      /mesenc[ée]falo/i,
      /bulbo/i,
    ],
  },
  {
    chave: 'medular',
    padroes: [/medular/i, /medula/i, /espinhal/i, /mielop[aá]tica/i],
  },
];

export function normalizarRegiao(regiao: string | null): RegiaoCanonica {
  if (!regiao) return 'outra';
  const texto = regiao.trim().toLowerCase();
  if (!texto) return 'outra';

  for (const grupo of MAPA_REGIOES) {
    if (grupo.padroes.some((padrao) => padrao.test(texto))) {
      return grupo.chave;
    }
  }

  return 'outra';
}

export function normalizarLesoes(lesoes: Lesao[]) {
  return lesoes.map((lesao) => ({
    ...lesao,
    regiao: normalizarRegiao(lesao.regiao),
    localizacao: lesao.localizacao ?? lesao.regiao,
  }));
}