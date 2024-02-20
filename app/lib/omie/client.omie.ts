import { OmieCredentials, OmieSearchParams } from "../definitions/OmieApi";
import { OmieClientModel, OmieClientResponse } from "../definitions/OmieClient";
import { OmieBaseService } from "./base.omie";

class ClientService extends OmieBaseService {

  async find(codigo_cliente_omie: string) {
    try {
      const data = this.formatSingleBodyRequest('ConsultarCliente', {
        codigo_cliente_omie
      });
      const response = await this._httpProvider.post<OmieClientModel>('/geral/clientes/', data);
      return response.data;
    } catch {
      return null;
    }
  }

  async findAll(params?: OmieSearchParams, secrets?: Partial<OmieCredentials>): Promise<OmieClientResponse> {
    const data = this.formatOmieBodyRequest('ListarClientes', params, secrets);
    const response = await this._httpProvider.post<OmieClientResponse>('/geral/clientes/', data);
    return response.data;
  }
}

export const OmieClientService = new ClientService();