import React, { Fragment } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    createClientPayment,
    fetchClients,
    fetchOffers,
} from "@/app/lib/actions";
import { Autocomplete } from "@/app/ui/autocomplete";
import { usePaymentCreateForm } from "./form-provider";
import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { cn } from "@/app/utils/cn";
import InstallmentCard from "./components/InstallmentCard";

export function PaymentCreateForm() {
    const {
        clients,
        offers,
        formType,
        client,
        offerId,
        clientQuery,
        setClient,
        setClients,
        setFormType,
        setOfferId,
        setOffers,
        isFetchingOffers,
        setIsFetchingOffers,
        isFetchingClients,
        setIsFetchingClients,
        setClientQuery,
        offerPortions,
        currentOffer,
        register,
    } = usePaymentCreateForm();

    const handleAutocompleteSearch = useDebouncedCallback((query: string) => {
        listClients(query);
        setClientQuery(query);
    }, 500);

    async function handleAction(formData: FormData) {
        if (offerId) {
            formData.append("offer_id", offerId);
        }

        if (client) {
            const binded = createClientPayment.bind(
                null,
                client as OmieClientModel
            );
            await binded(formData);
        }

        // await createPayment(formData);
    }

    async function listClients(query: string) {
        if (query === "") return;

        setIsFetchingClients(true);
        const data = await fetchClients({
            pagina: 1,
            registros_por_pagina: 1000,
            clientesFiltro: {
                nome_fantasia: query,
            },
        });

        setClients(data.clientes_cadastro);
        setIsFetchingClients(false);
    }

    async function listClientOffers(client: OmieClientModel) {
        const clientId = client.codigo_cliente_omie;
        setIsFetchingOffers(true);
        const data = await fetchOffers({
            pagina: 1,
            registros_por_pagina: 100,
            filtrar_por_cliente: clientId,
        });

        setClient(client);
        setOffers(data.pedido_venda_produto);
        setIsFetchingOffers(false);
    }

    return (
        <form
            action={handleAction}
            className="space-y-8 overflow-y-auto max-h-full scroll-slim p-2 border-4 border-transparent py-4"
        >
            <section className="space-y-4">
                <div>
                    <label className="text-base font-medium text-gray-900">
                        Pagante
                    </label>
                    <p className="text-sm text-gray-500">
                        Registre os dados do pagante.
                    </p>
                </div>

                <fieldset>
                    <label className="text-sm font-medium text-gray-900">
                        Tipo do pagante
                    </label>
                    <div className="relative mt-1 gap-3 flex items-center">
                        <div className="flex h-6 items-center">
                            <input
                                id="subclient"
                                defaultChecked={formType === "subclient"}
                                aria-describedby="small-description"
                                name="client_type"
                                type="radio"
                                value="subclient"
                                onChange={() => setFormType("subclient")}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                        </div>
                        <div className="flex gap-2 text-sm leading-6">
                            <label
                                htmlFor="subclient"
                                className="font-medium text-gray-900"
                            >
                                Avulso
                                <span
                                    id="subclient"
                                    className="text-gray-500 ml-2"
                                >
                                    O pagamento será registrado em nome de um
                                    pagante não-cliente.
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="relative gap-3 flex items-center">
                        <div className="flex h-6 items-center">
                            <input
                                id="client"
                                aria-describedby="small-description"
                                name="client_type"
                                value="client"
                                type="radio"
                                onChange={() => setFormType("client")}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                        </div>
                        <div className="flex gap-2 text-sm">
                            <label
                                htmlFor="client"
                                className="font-medium text-gray-900"
                            >
                                Cliente
                                <span
                                    id="client"
                                    className="text-gray-500 ml-2"
                                >
                                    O pagamento será registrado em nome de
                                    cliente.
                                </span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <label
                        htmlFor="enterprise_id"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Empresa
                    </label>
                    <select
                        id="enterprise_id"
                        name="enterprise_id"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="default">Selecione uma empresa</option>
                        <option value="wfc_tech">WFC Technology</option>
                        <option value="bws_iot">BWS IoT</option>
                        <option value="icb">ICB</option>
                    </select>
                </fieldset>

                {formType === "subclient" ? (
                    <fieldset>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email do pagante
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                    </fieldset>
                ) : (
                    <fieldset className="space-y-2">
                        <Autocomplete
                            label="Cliente"
                            placeholder="Selecione um cliente"
                            defaultInputValue={clientQuery}
                            onInputChange={handleAutocompleteSearch}
                            isLoading={isFetchingClients}
                            options={clients?.map((client) => ({
                                label: client.nome_fantasia,
                                value: client,
                            }))}
                            onChange={(option: any) => {
                                listClientOffers(option.value);
                            }}
                        />

                        <Autocomplete
                            label="Proposta (opcional)"
                            placeholder="Selecione uma proposta para vincular"
                            isLoading={isFetchingOffers}
                            options={offers?.map((offer) => ({
                                label: `Código da proposta: ${offer.cabecalho.codigo_pedido}`,
                                value: offer,
                            }))}
                            onChange={(option: any) => {
                                setOfferId(
                                    option.value.cabecalho.codigo_pedido
                                );
                            }}
                        />
                    </fieldset>
                )}
            </section>
            {currentOffer && (
                <section className="space-y-4 w-full">
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <Fragment>
                                <Disclosure.Button className="py-2 w-full bg-gray-100 flex flex-row text-sm leading-5 font-medium justify-center rounded">
                                    {currentOffer.lista_parcelas.parcela.length}{" "}
                                    Parcela(s)
                                    <ChevronUpIcon
                                        className={cn(
                                            "ml-2 h-5 w-5 transition-all duration-300 text-gray-500",
                                            open && "rotate-180 transform"
                                        )}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="flex flex-col gap-4 border-4 border-transparent scroll-slim bg-gray-100 overflow-x-hidden px-6 max-h-[280px] overflow-y-auto py-4 rounded-md">
                                    {offerPortions().map((props, key) => (
                                        <InstallmentCard key={key} {...props} />
                                    ))}
                                </Disclosure.Panel>
                            </Fragment>
                        )}
                    </Disclosure>
                </section>
            )}

            <section className="space-y-4">
                <div>
                    <label className="text-base font-medium text-gray-900">
                        Pagamento
                    </label>
                </div>

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
                                <span className="text-gray-500 sm:text-sm">
                                    R$
                                </span>
                            </div>
                            <input
                                type="text"
                                autoComplete="price"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="0.00"
                                {...register("price")}
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
