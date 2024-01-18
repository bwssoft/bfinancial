import axios, { AxiosInstance } from 'axios'
import { env } from '../../config'
import { CallFunctions, IBaseService, OmieDefaultParams } from '../../interfaces/services/@shared';
import { HandlingPagination } from '../../utils';

export class BaseService implements IBaseService {
  private _apiSecret: string
  private _apiKey: string
  private _baseUrl: string
  public _httpProvider: AxiosInstance;

  constructor() {
    this._apiKey = env.OMIE_API_KEY;
    this._apiSecret = env.OMIE_API_SECRET;
    this._baseUrl = env.OMIE_URL;
    this._httpProvider = axios.create({
      baseURL: this._baseUrl,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  formatBodyRequest(call: CallFunctions, params?: Omit<OmieDefaultParams, 'apenas_importado_api'>) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      param: [HandlingPagination(params)]
    }
  }
}