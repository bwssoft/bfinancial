import axios, { AxiosInstance } from "axios";

import {
  OmieCallFunctions,
  OmieCredentials,
  OmieDefaultParams,
  OmieEnterpriseEnum,
  OmieSingleCallFunctions,
} from "@/app/lib/definitions/OmieApi";
import { env } from "@/app/lib/enviroment";

export class OmieBaseService {
  private _apiSecret: string = "";
  private _apiKey: string = "";
  private _baseUrl: string;
  public _httpProvider: AxiosInstance;

  constructor() {
    this._baseUrl = env.OMIE_URL;
    this._httpProvider = axios.create({
      baseURL: this._baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._httpProvider.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response) {
          console.log(error.response.status, error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  private handlePagination(
    params: Omit<OmieDefaultParams, "apenas_importado_api"> = {
      pagina: 1,
      registros_por_pagina: 10,
    }
  ) {
    return {
      apenas_importado_api: "N",
      pagina: params.pagina ?? 1,
      registros_por_pagina: params.registros_por_pagina ?? 10,
    } as OmieDefaultParams;
  }

  formatOmieBodyRequest(
    call: OmieCallFunctions,
    params?: Omit<OmieDefaultParams, "apenas_importado_api">,
    secrets?: Partial<OmieCredentials>
  ) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      // param: [this.handlePagination(params)] ### não estava passando os paramentros?
      param: [{ ...params, ...this.handlePagination(params) }],
    };
  }

  formatSingleBodyRequest<T>(call: OmieSingleCallFunctions, params?: T) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      param: [params],
    };
  }

  formatBody<T>(call: OmieCallFunctions, params?: T) {
    return {
      call,
      app_key: this._apiKey,
      app_secret: this._apiSecret,
      param: [params],
    };
  }

  setSecrets(params: OmieEnterpriseEnum) {
    this._apiKey = env.OMIE_SECRETS[params].key;
    this._apiSecret = env.OMIE_SECRETS[params].secret;
  }
}
