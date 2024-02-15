"use client";

import React from "react";

import { PaymentCreateForm } from "./payment-create";

import { OmieClientModel } from "@/app/lib/definitions/OmieClient";
import { OmieOffer } from "@/app/lib/definitions/OmieOffer";

interface ContextValues {
  formType: "subclient" | "client";
  setFormType: React.Dispatch<React.SetStateAction<"subclient" | "client">>;
  client?: OmieClientModel;
  setClient: React.Dispatch<React.SetStateAction<OmieClientModel | undefined>>;
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
      }}
    >
      <PaymentCreateForm />
    </PaymentCreateFormContext.Provider>
  );
}

export const usePaymentCreateForm = () => {
  return React.useContext(PaymentCreateFormContext);
};
