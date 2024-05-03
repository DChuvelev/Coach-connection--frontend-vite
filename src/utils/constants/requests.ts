export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.wtwrdc.surfnet.ca"
    : "http://localhost:3001";

export const dbApiRequest = {
  baseUrl: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

export const gptApiRequest = {
  baseUrl: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
};
