import 'dotenv/config';

export const API_BACKEND_HOST = process?.env?.API_BACKEND_HOST || "127.0.0.1";
export const PORT = process?.env?.API_BACKEND_PORT || 5000;
export const API_PAYLOAD_MAX_SIZE = process?.env?.API_PAYLOAD_MAX_SIZE || "7mb";

export const GOOGLE_CLOUD_LOCATION = process?.env?.GOOGLE_CLOUD_LOCATION;
export const GOOGLE_CLOUD_PROJECT = process?.env?.GOOGLE_CLOUD_PROJECT;

if (!GOOGLE_CLOUD_PROJECT || !GOOGLE_CLOUD_LOCATION) {
  console.error("Error: Environment variables GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION must be set.");
  process.exit(1);
}

export const PROXY_HEADER = process?.env?.PROXY_HEADER;
if (!PROXY_HEADER) {
  console.error("Error: Environment variables PROXY_HEADER must be set.");
  process.exit(1);
}
