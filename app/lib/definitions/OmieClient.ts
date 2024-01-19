import { z } from "zod";
import { OmieResponse } from "./OmieApi";

export const OmieClientSchema = z.object({
  "bairro": z.string(),
  "bloquear_faturamento": z.string(),
  "cep": z.string(),
  "cidade": z.string(),
  "cidade_ibge": z.string(),
  "cnpj_cpf": z.string(),
  "codigo_cliente_integracao": z.string(),
  "codigo_cliente_omie": z.number(),
  "codigo_pais": z.string(),
  "complemento": z.string(),
  "contato": z.string(),
  "dadosBancarios": z.object({
    "agencia": z.string(),
    "cChavePix": z.string(),
    "codigo_banco": z.string(),
    "conta_corrente": z.string(),
    "doc_titular": z.string(),
    "nome_titular": z.string(),
    "transf_padrao": z.string()
  }),
  "email": z.string(),
  "endereco": z.string(),
  "enderecoEntrega": z.any(),
  "endereco_numero": z.string(),
  "estado": z.string(),
  "exterior": z.string(),
  "homepage": z.string(),
  "inativo": z.string(),
  "inscricao_estadual": z.string(),
  "inscricao_municipal": z.string(),
  "nome_fantasia": z.string(),
  "pessoa_fisica": z.string(),
  "razao_social": z.string(),
  "recomendacoes": z.object({
    "codigo_vendedor": z.number(),
    "email_fatura": z.string(),
    "gerar_boletos": z.string()
  }),
  "tags": z.array(z.any()),
  "telefone1_ddd": z.string(),
  "telefone1_numero": z.string(),
  "telefone2_ddd": z.string(),
  "telefone2_numero": z.string()
})

export type OmieClientModel = z.infer<typeof OmieClientSchema>;

export type OmieClientResponse = OmieResponse & {
  clientes_cadastro: Array<OmieClientModel>
}
