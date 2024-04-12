import { OmieEnterpriseEnum } from "@/app/lib/definitions/OmieApi";
import { Button } from "../../button";

export function DueDetachedForm(props: {
  omie_enterprise?: OmieEnterpriseEnum;
}) {
  const { omie_enterprise } = props;
  return (
    <form className="space-y-8 overflow-y-auto max-h-full scroll-slim p-2 border-4 border-transparent py-4">
      <section className="space-y-4">
        <fieldset>
          <label
            htmlFor="omie_enterprise"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Empresa
          </label>
          <select
            id="omie_enterprise"
            name="omie_enterprise"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={omie_enterprise}
          >
            <option value="default">Selecione uma empresa</option>
            <option value="WFC">WFC Technology</option>
            <option value="BWS">BWS IoT</option>
            <option value="ICB">ICB</option>
            <option value="ICBFILIAL">ICB Filial</option>
            <option value="MGC">MGC</option>
          </select>
        </fieldset>

        <fieldset>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Valor
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
              <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                name="price"
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
          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Telefone para envio da cobrança
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option selected={true}>BR</option>
                </select>
              </div>
              <input
                type="text"
                name="phone-number"
                id="phone-number"
                className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="(11) 9 9954-6543"
              />
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
