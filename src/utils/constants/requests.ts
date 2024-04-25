const ApiKey = "Api-Key AQVNx-1FDM8u5Lkpswzf6eRpLk6aff3XgaIbr72t";
const ApiModelUri = "gpt://b1gu33no7s7tc1g4hp39/yandexgpt-lite";
const ApiPostRequestUrl =
  "https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync";
const ApiGetResponseUrl = "https://operation.api.cloud.yandex.net/operations/";
export const apiPostRequest = {
  baseUrl: ApiPostRequestUrl,
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
    Authorization: ApiKey,
  },
  body: {
    modelUri: ApiModelUri,
    completionOptions: {
      stream: false,
      temperature: 0.1,
      maxTokens: "2000",
    },
  },
};

export const apiGetRequest = {
  baseUrl: ApiGetResponseUrl,
  method: "GET",
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
    Authorization: ApiKey,
  },
};

export const dbApiRequest = {
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.wtwrdc.surfnet.ca"
      : "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
};

export const gptApiRequest = {
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.wtwrdc.surfnet.ca"
      : "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
};
