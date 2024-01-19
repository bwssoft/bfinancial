import { OmieDefaultParams } from "../interfaces/services/@shared"

export const HandlingPagination = (params: Omit<OmieDefaultParams, 'apenas_importado_api'> = { pagina: 1, registros_por_pagina: 10 }) => {
  return {
    apenas_importado_api: "N",
    pagina: params.pagina ?? 1,
    registros_por_pagina: params.registros_por_pagina ?? 10
  } as OmieDefaultParams;
}