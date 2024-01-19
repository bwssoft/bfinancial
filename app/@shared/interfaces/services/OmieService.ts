import { IBaseService, OmieClientResponse, OmieDefaultParams } from "./@shared";

export interface IOmieService extends IBaseService {
  findAllClients: (params?: Omit<OmieDefaultParams, 'apenas_importado_api'>) => Promise<OmieClientResponse>
}