import { CallFunctions, OmieDefaultParams } from ".";

export interface IBaseService {
  formatBodyRequest: (call: CallFunctions, params?: Omit<OmieDefaultParams, 'apenas_importado_api'>) => object;
}