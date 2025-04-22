// config.js
export const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://amazonalign-production.up.railway.app"; // substitua pelo seu real
// Log no console
console.log("🌐 Frontend rodando em:", window.location.origin);
console.log("🔗 Conectando com API em:", BASE_URL);