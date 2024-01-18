import { EClientsOmie } from "../../config"
import { OmieDefaultParams } from "../../interfaces/services/@shared"

export type FindManyAction = {
  type: EClientsOmie.FIND_MANY,
  payload: Omit<OmieDefaultParams, 'apenas_importado_api'>
}

export interface State {
  [EClientsOmie.FIND_MANY]: Omit<OmieDefaultParams, 'apenas_importado_api'>
}

export type Action = FindManyAction;

export const reducer = (state: State, action: Action) => {
  return { ...state, [action.type]: action.payload }
}

export const initialState = {
  findManyClients: {
    pagina: 1,
    registros_por_pagina: 10
  }
} as State