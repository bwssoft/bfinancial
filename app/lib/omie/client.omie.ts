import { OmieSearchParams } from "../definitions/OmieApi";
import { OmieClientResponse } from "../definitions/OmieClient";
import { OmieBaseService } from "./base.omie";

class ClientService extends OmieBaseService {
  async findAll(params?: OmieSearchParams): Promise<OmieClientResponse> {
    const data = this.formatOmieBodyRequest('ListarClientes', params);
    const response = await this._httpProvider.post<OmieClientResponse>('/geral/clientes/', data);
    return response.data;
  }
}

export const OmieClientService = new ClientService();