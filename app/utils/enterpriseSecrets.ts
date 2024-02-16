export type CompaniesOmie = 'MGC' | 'BWS' | 'ICB' | 'ICB_SP_FILIAL' | 'WFC'
export type CredentialsRequest = {
  [key in CompaniesOmie]: {
    apiKey: string;
    apiSecret: string;
  }
}

export const CompaniesSecrets: CredentialsRequest = {
  "MGC": {
    apiKey: "837076496256",
    apiSecret: "8c747cbd96bb28e4bc7439455551b30a"
  },
  "WFC": {
    apiKey: "837084162915",
    apiSecret: "b5ddd3a52d0aea76e9c8c965143c6045"
  },
  "BWS": {
    apiKey: "837068829597",
    apiSecret: "6335bf0d53b177a0adabd5a6c08dd996"
  },
  "ICB": {
    apiKey: "972147694518",
    apiSecret: "5fea0562905506173f8ac94e527704c0"
  },
  "ICB_SP_FILIAL": {
    apiKey: "3590327076336",
    apiSecret: "929da5d861c6eb745f17ceb6a0213200"
  }
}