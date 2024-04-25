export interface GptApiConstructorProps {
  baseUrl: string;
  headers: HeadersInit;
}

export interface GptResponseMessage {
  message: {
    role: string;
    text: string;
  };
  status: string;
}

export type GptAnswer = GptResponseMessage[];
