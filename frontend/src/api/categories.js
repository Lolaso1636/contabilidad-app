// FRONTEND - src/api/categories.js

const API_URL = 'http://localhost:3001/api/categories';

export async function getCategories() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
