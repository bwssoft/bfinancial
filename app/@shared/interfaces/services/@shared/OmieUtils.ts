import { ClientModel } from "@/app/@shared/models/Client"

export type OmieResponse = {
  "pagina": number,
  "total_de_paginas": number,
  "registros": number,
  "total_de_registros": number,
}

export type OmieDefaultParams = {
  "pagina": number,
  "registros_por_pagina": number,
  "apenas_importado_api": "N"
}

export type OmieClientResponse = OmieResponse & {
  clientes_cadastro: Array<ClientModel>
}

export type CallFunctions = 'ListarClientes';