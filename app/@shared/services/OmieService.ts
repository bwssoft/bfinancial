import { IOmieService } from "../interfaces/services";
import { OmieClientResponse, OmieDefaultParams } from "../interfaces/services/@shared";
import { BaseService } from "./@shared";

export class OmieService extends BaseService implements IOmieService  {
  async findAllClients(params?: Omit<OmieDefaultParams, 'apenas_importado_api'>): Promise<OmieClientResponse> {
    const data = this.formatBodyRequest("ListarClientes", params);

    const response = await this._httpProvider.post<OmieClientResponse>('geral/clientes/', data);

    return response.data;
  }
}