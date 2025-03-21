// authUtils.js
export function verificarAutenticacao() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Usuário não autenticado! Redirecionando para login.");
    window.location.href = "/login.html";
    return false;
  }
  return true;
}
