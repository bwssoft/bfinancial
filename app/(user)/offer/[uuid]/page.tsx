import { fetchOfferById } from "@/app/lib/actions";

export default async function Example({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  const offer = await (await fetchOfferById(parseInt(params.uuid))).pedido_venda_produto

  return (
    <div>
      <ul>
        <li>Codigo: {offer.cabecalho.codigo_pedido}</li>
        <li>Valor mercadorias: {offer.total_pedido.valor_mercadorias}</li>
        <li>Valor total: {offer.total_pedido.valor_total_pedido}</li>
        <li>Observacoes de venda: {offer.observacoes?.obs_venda}</li>
      </ul>
    </div>
  )
}
