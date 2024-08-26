"use client";
import { Button } from "../../button";
import { toast } from "@/app/hook/use-toast";
import { Autocomplete, AutocompleteResponse } from "../../autocomplete";
import { enterprises } from "../../tables/clients/filter";
import { useDetachedShipment } from "./use-detached-shipment";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Label } from "../../label";
import { Input } from "../../input";
import { Alert } from "../../alert";
import { createDetachedShipmentPayment } from "@/app/lib/actions";

export function DueDetachedShipmentForm() {
  const {
    handleChangeEnterprise,
    handleChangeClient,
    handleSearchClients,
    clients,
    client,
    enterprise,
  } = useDetachedShipment();

  async function handleAction(form: FormData) {
    try {
      if (!enterprise) {
        toast({
          title: "Erro",
          description: "Selecione uma empresa",
          variant: "error",
        });
        return;
      }
      if (!client) {
        toast({
          title: "Erro",
          description: "Selecione um cliente",
          variant: "error",
        });
        return;
      }
      const group = crypto.randomUUID();
      const binded = createDetachedShipmentPayment.bind(null, {
        cnpj_cpf: client.cnpj_cpf,
        codigo_cliente_omie: String(client.codigo_cliente_omie),
        nome_fantasia: client.nome_fantasia,
        omie_enterprise: enterprise,
        group,
      });
      await binded(form);
      toast({
        title: "Sucesso!",
        description: "Nova cobrança efetuada com sucesso!",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "error",
      });
    }
  }

  return (
    <form
      action={handleAction}
      className="space-y-8 overflow-y-auto max-h-full scroll-slim p-2 border-4 border-transparent py-4"
    >
      <section className="space-y-4">
        <fieldset>
          <div>
            <Autocomplete
              label="Selecionar empresa"
              options={enterprises.map((enterprise) => ({
                label: enterprise.name,
                value: enterprise.id,
              }))}
              onChange={(newValue) =>
                handleChangeEnterprise(newValue as AutocompleteResponse<string>)
              }
            />
          </div>
        </fieldset>

        <fieldset>
          <div>
            <Autocomplete
              label="Cliente"
              placeholder="Filtrar cliente"
              options={clients?.map((client) => ({
                label: client.nome_fantasia,
                value: client,
              }))}
              onInputChange={handleSearchClients}
              onChange={(newValue) =>
                handleChangeClient(
                  newValue as AutocompleteResponse<OmieClientModel>
                )
              }
            />
          </div>
        </fieldset>

        <fieldset>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Valor
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-600 bg-white">
              <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                autoComplete="price"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="0.00"
              />
              <div className="pointer-events-none inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  BRL
                </span>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <Label>Email</Label>
          <Input name="contact_email" defaultValue={client?.email} />
          <Alert
            title="Lembre de verificar o email"
            variant="warning"
            className="py-2 mt-2"
          />
        </fieldset>

        <fieldset>
          <Label>Telefone</Label>
          <Input
            name="contact_phone"
            defaultValue={
              client?.telefone1_ddd
                ? `${client?.telefone1_ddd}${client?.telefone1_numero}`
                : undefined
            }
          />
          <Alert
            title="Lembre de verificar o número de telefone"
            variant="warning"
            className="py-2 mt-2"
          />
        </fieldset>
      </section>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          variant={"outline"}
          type="reset"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Limpar
        </Button>
        <Button type="submit">Criar Cobrança do Frete</Button>
      </div>
    </form>
  );
}
