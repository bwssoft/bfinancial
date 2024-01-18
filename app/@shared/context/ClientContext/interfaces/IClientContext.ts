import { OmieClientResponse } from "@/app/@shared/interfaces/services/@shared"
import { UseQueryResult } from "@tanstack/react-query"
import { Action, State } from "../reducer"

export type IClientContext = {
  findManyClients: UseQueryResult<OmieClientResponse, Error>
  setQuery: (type: Action['type'], payload: Action['payload']) => void
  state: State
}