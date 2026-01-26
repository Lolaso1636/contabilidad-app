export async function getAccounts() {
  const res = await fetch("http://localhost:3001/api/accounts");
  if (!res.ok) throw new Error("Error cargando cuentas");
  return res.json();
}
