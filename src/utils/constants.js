//production
// export const BASE_URL = "/api";
//local dev
export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:3000" : "/api";
