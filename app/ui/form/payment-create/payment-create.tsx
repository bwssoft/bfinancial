"use client"
import React from 'react';
import { createPayment } from "@/app/lib/actions";
import { Autocomplete } from '../../autocomplete';

export function PaymentCreateForm() {
  const [formType, setFormType] = React.useState<'subclient' | 'client'>('subclient');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      await createPayment(formData);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 py-4">
      <section className="space-y-4">
        <div>
          <label className="text-base font-medium text-gray-900">Pagante</label>
          <p className="text-sm text-gray-500">Registre os dados do pagante.</p>
        </div>

        <fieldset>
          <label className="text-sm font-medium text-gray-900">Tipo do pagante</label>
          <div className="relative mt-1 gap-3 flex items-center">
            <div className="flex h-6 items-center">
              <input id="subclient" defaultChecked={formType === 'subclient'} aria-describedby="small-description" name="client_type" type="radio" value="subclient" onChange={() => setFormType('subclient')} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            </div>
            <div className="flex gap-2 text-sm leading-6">
              <label htmlFor="subclient" className="font-medium text-gray-900">
                Avulso
                <span id="subclient" className="text-gray-500 ml-2">O pagamento será registrado em nome de um pagante não-cliente.</span>
              </label>
            </div>
          </div>
          <div className="relative gap-3 flex items-center">
            <div className="flex h-6 items-center">
              <input id="client" aria-describedby="small-description" name="client_type" value="client" type="radio" onChange={() => setFormType('client')} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            </div>
            <div className="flex gap-2 text-sm">
              <label htmlFor="client" className="font-medium text-gray-900">
                Cliente
                <span id="client" className="text-gray-500 ml-2">O pagamento será registrado em nome de cliente.</span>
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <label htmlFor="enterprise_id" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
          <select id="enterprise_id" name="enterprise_id" className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="default">Selecione uma empresa</option>
            <option value="wfc_tech">WFC Technology</option>
            <option value="bws_iot">BWS IoT</option>
            <option value="icb">ICB</option>
          </select>
        </fieldset>

        {formType === 'subclient' ? (
          <fieldset>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email do pagante</label>
              <div className="mt-1">
                <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="you@example.com" />
              </div>
            </div>
          </fieldset>
        ) : (
          <fieldset className="space-y-2">
            <Autocomplete 
              label="Cliente"
              placeholder="Selecione um cliente"
              options={[
                { label: 'Cliente 1', value: { id: 1, name: 'Cliente 1' }},
                { label: 'Empresa', value: { id: 1, name: 'Empresa' }},
                { label: 'Companhia', value: { id: 1, name: 'Companhia' }},
                { label: 'Estabelecimento', value: { id: 1, name: 'Estabelecimento' }},
                { label: 'Lojinha', value: { id: 1, name: 'Lojinha' }},
              ]}
            />

            <Autocomplete 
              label="Proposta (opcional)"
              placeholder="Selecione uma proposta para vincular"
              options={[
                { label: 'Proposta 1', value: { id: 1, name: 'Proposta 1' }},
                { label: 'Proposta 2', value: { id: 1, name: 'Proposta 2' }},
                { label: 'Proposta 3', value: { id: 1, name: 'Proposta 3' }},
              ]}
            />
          </fieldset>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <label className="text-base font-medium text-gray-900">Pagamento</label>
        </div>

        <fieldset>
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Valor</label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
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
                <span
                  className="text-gray-500 sm:text-sm"
                  id="price-currency"
                >
                  BRL
                </span>
              </div>
            </div>
          </div>
        </fieldset>
      </section>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="reset"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Limpar
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Criar Pagamento
        </button>
      </div>
    </form>
  );
}
