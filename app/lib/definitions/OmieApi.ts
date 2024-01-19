
export type OmieResponse = {
  "pagina": number,
  "total_de_paginas": number,
  "registros": number,
  "total_de_registros": number,
}

export type OmieBoolean = "S" | "N"

export type OmieDefaultParams = {
  "pagina": number,
  "registros_por_pagina": number,
  "apenas_importado_api": "N"
}

export type OmieSearchParams = Omit<OmieDefaultParams, 'apenas_importado_api'>;

export type OmieCallFunctions = 
  | 'ListarClientes'
  | 'ListarPedidos'
  | 'ConsultarCliente'
  | 'ConsultarPedido';

export type OmieSingleCallFunctions = 
  | 'ConsultarCliente'
  | 'ConsultarPedido'