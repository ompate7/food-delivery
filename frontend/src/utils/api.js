const BASE = "https://food-delivery-three-topaz.vercel.app/api";

export async function fetchMenu() {
  const res = await fetch(`${BASE}/menu`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function placeOrder(payload) {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchOrder(id) {
  const res = await fetch(`${BASE}/orders/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}
