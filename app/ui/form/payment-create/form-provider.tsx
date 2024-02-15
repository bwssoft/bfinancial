"use client";

import React, { useCallback, useMemo } from "react";

import { PaymentCreateForm } from "./payment-create";

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import {
    OmieOffer,
    OmieOfferInstallment,
} from "@/app/lib/definitions/OmieOffer";
import { z } from "zod";
import { UseFormRegister, UseFormSetValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    price: z.coerce.number().optional(),
});

export type IPaymentFormData = z.infer<typeof schema>;

interface ContextValues {
    formType: "subclient" | "client";
    setFormType: React.Dispatch<React.SetStateAction<"subclient" | "client">>;
    client?: OmieClientModel;
    setClient: React.Dispatch<
        React.SetStateAction<OmieClientModel | undefined>
    >;
    offerId?: string;
    clientQuery?: string;
    setOfferId: React.Dispatch<React.SetStateAction<string | undefined>>;
    offers: OmieOffer[];
    setOffers: React.Dispatch<React.SetStateAction<OmieOffer[]>>;
    clients: OmieClientModel[];
    setClients: React.Dispatch<React.SetStateAction<OmieClientModel[]>>;
    isFetchingOffers: boolean;
    setIsFetchingClients: React.Dispatch<React.SetStateAction<boolean>>;
    isFetchingClients: boolean;
    setIsFetchingOffers: React.Dispatch<React.SetStateAction<boolean>>;
    setClientQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
    offerPortions: () => Array<OmieOfferInstallment>;
    currentOffer: OmieOffer | undefined;
    register: UseFormRegister<IPaymentFormData>;
    setValue: UseFormSetValue<IPaymentFormData>;
}

export const PaymentCreateFormContext = React.createContext(
    {} as ContextValues
);

export function PaymentCreateFormProvider() {
    const [formType, setFormType] = React.useState<"subclient" | "client">(
        "subclient"
    );

    const [clientQuery, setClientQuery] = React.useState<string>();
    const [client, setClient] = React.useState<OmieClientModel>();

    const [isFetchingClients, setIsFetchingClients] =
        React.useState<boolean>(false);
    const [clients, setClients] = React.useState<OmieClientModel[]>([]);

    const [offerId, setOfferId] = React.useState<string>();

    const [isFetchingOffers, setIsFetchingOffers] =
        React.useState<boolean>(false);
    const [offers, setOffers] = React.useState<OmieOffer[]>([]);

    const offerPortions = useCallback(() => {
        if (!offerId) {
            return [];
        }

        const offerContent = offers.find(
            (props) => props.cabecalho.codigo_pedido === Number(offerId)
        );

        return offerContent?.lista_parcelas.parcela || [];
    }, [offerId]);

    const currentOffer = useMemo(() => {
        const data = offers.find(
            (props) => props.cabecalho.codigo_pedido === Number(offerId)
        );
        console.log(data);
        return data;
    }, [offerId]);

    const { register, setValue } = useForm<IPaymentFormData>({
        resolver: zodResolver(schema),
    });

    return (
        <PaymentCreateFormContext.Provider
            value={{
                clients,
                setClients,
                offers,
                setOffers,
                formType,
                setFormType,
                client,
                setClient,
                offerId,
                setOfferId,
                isFetchingOffers,
                setIsFetchingOffers,
                isFetchingClients,
                setIsFetchingClients,
                clientQuery,
                setClientQuery,
                offerPortions,
                currentOffer,
                register,
                setValue,
            }}
        >
            <PaymentCreateForm />
        </PaymentCreateFormContext.Provider>
    );
}

export const usePaymentCreateForm = () => {
    return React.useContext(PaymentCreateFormContext);
};
