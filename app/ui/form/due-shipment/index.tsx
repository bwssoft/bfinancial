"use client";
import { toast } from "@/app/hook/use-toast";
import { createDetachedPaymentFromOfferPage } from "@/app/lib/actions";
import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { Button } from "../../button";
import { FormGroup } from "../../form-group";
import { Label } from "../../label";
import { PhoneInput } from "../../phone-input";

export function DueShipmentForm(props: {
  omie_enterprise: OmieEnterpriseEnum;
  contact_email: string;
  contact_phone: string;
  codigo_pedido_omie: string;
  cnpj_cpf: string;
  codigo_cliente_omie: string;
  nome_fantasia: string;
}) {
  const {
    omie_enterprise,
    contact_email,
    contact_phone,
    codigo_pedido_omie,
    cnpj_cpf,
    codigo_cliente_omie,
    nome_fantasia,
  } = props;

  async function handleAction(form: FormData) {
    try {
      const createPaymentFromOfferPageBinded = createDetachedPaymentFromOfferPage.bind(null, {
        omie_enterprise: omie_enterprise,
        codigo_pedido_omie: codigo_pedido_omie,
        cnpj_cpf: cnpj_cpf,
        codigo_cliente_omie: codigo_cliente_omie,
        nome_fantasia: nome_fantasia,
      });

      await createPaymentFromOfferPageBinded(form);

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
        <FormGroup>
          <Label>Telefone do cliente</Label>
          <PhoneInput name="contact_phone" value={contact_phone} />
        </FormGroup>

        <fieldset>
          <div>
            <label
              htmlFor="contact_email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email do cliente
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                name="contact_email"
                id="contact_email"
                defaultValue={contact_email}
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Valor
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-600">
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
      </section>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          variant={"outline"}
          type="reset"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Limpar
        </Button>
        <Button type="submit">Criar Pagamento</Button>
      </div>
    </form>
  );
}
