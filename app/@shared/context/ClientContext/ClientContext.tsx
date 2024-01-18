"use client";

import React, { ReactNode, createContext, useReducer } from "react";
import { Action, initialState, reducer } from "./reducer";
import { useQuery } from "@tanstack/react-query";
import { EClientsOmie } from "../../config";
import { OmieService } from "../../services";
import { IClientContext } from "./interfaces";
import axios from "axios";
import { OmieClientResponse } from "../../interfaces/services/@shared";

export const ClientContext = createContext({} as IClientContext);

export const ClientContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const _service = new OmieService();

    const findManyClients = useQuery({
        queryKey: [EClientsOmie.FIND_MANY, state[EClientsOmie.FIND_MANY]],
        enabled: true,
        staleTime: Infinity,
        queryFn: async () => {
            const response = await axios.post<OmieClientResponse>(
                "/api/clients/FindMany",
                state[EClientsOmie.FIND_MANY]
            );
            return response.data;
        },
    });

    console.log(findManyClients.data);

    const setQuery = (type: Action["type"], payload: Action["payload"]) => {
        dispatch({ payload, type });
    };

    return (
        <ClientContext.Provider
            value={{
                findManyClients,
                setQuery,
                state,
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};
