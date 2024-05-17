export const baseUrl = "http://api.coachfind.me";
// process.env.NODE_ENV === "production"
//   ? "https://104.199.113.137"
//   : "http://localhost:3001";

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
