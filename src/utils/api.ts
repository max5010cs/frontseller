import type { Flower, Order } from '../types';

const API_BASE = 'https://flowybackend.onrender.com/api/v1';

export const api = {
  async authenticateSeller(encryptedId: string) {
    const response = await fetch(`${API_BASE}/seller/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth: encryptedId }),
    });
    if (!response.ok) throw new Error('Failed to authenticate seller');
    return await response.json();
  },
  async getFlowers(sellerId: string): Promise<Flower[]> {
    const response = await fetch(`${API_BASE}/seller/flowers?seller_id=${sellerId}`);
    if (!response.ok) throw new Error('Failed to fetch flowers');
    return await response.json();
  },
  async getCustomRequests() {
    const response = await fetch(`${API_BASE}/seller/custom_requests`);
    if (!response.ok) throw new Error('Failed to fetch custom requests');
    return await response.json();
  },
  async getOrders(sellerId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/seller/orders?seller_id=${sellerId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  },
  async uploadFlower(formData: FormData) {
    const response = await fetch(`${API_BASE}/seller/flowers`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload flower');
    return await response.json();
  },
  async addOrder(order: Partial<Order>) {
    const response = await fetch(`${API_BASE}/seller/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to add order');
    return await response.json();
  },
  async postBid(sellerId: string, bouquetId: string, price: number, lang: string = 'en') {
    const response = await fetch(`${API_BASE}/seller/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_id: sellerId, bouquet_id: bouquetId, price, lang }),
    });
    if (!response.ok) throw new Error('Failed to post bid');
    return await response.json();
  },
  async setPickup(orderId: string, pickupInfo: string, lang: string = 'en') {
    const response = await fetch(`${API_BASE}/seller/orders/${orderId}/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickup_info: pickupInfo, lang }),
    });
    if (!response.ok) throw new Error('Failed to set pickup');
    return await response.json();
  },
  async deleteFlower(flowerId: string) {
    const response = await fetch(`${API_BASE}/seller/flowers/${flowerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete flower');
    return await response.json();
  },
  async updateFlower(flowerId: string, formData: FormData) {
    const response = await fetch(`${API_BASE}/seller/flowers/${flowerId}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update flower');
    return await response.json();
  },
  async deleteFlowerWithSeller(flowerId: string, sellerId: string) {
    const response = await fetch(`${API_BASE}/seller/flowers/${flowerId}`, {
      method: 'DELETE',
      body: new URLSearchParams({ seller_id: sellerId }),
    });
    if (!response.ok) throw new Error('Failed to delete flower');
    return await response.json();
  },
};

export async function uploadFlower(formData: FormData) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/seller/flowers`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload flower');
  return await res.json();
}

export async function updateFlower(flowerId: string, formData: FormData) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/seller/flowers/${flowerId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update flower');
  return await res.json();
}

export async function deleteFlower(flowerId: string, sellerId: string) {
  const response = await fetch(`https://flowybackend.onrender.com/api/v1/seller/flowers/${flowerId}`, {
    method: 'DELETE',
    body: new URLSearchParams({ seller_id: sellerId }),
  });
  if (!response.ok) throw new Error('Failed to delete flower');
  return await response.json();
}

export async function getFlowers(sellerId?: string) {
  const url = sellerId
    ? `${process.env.BACKEND_URL}/api/v1/seller/flowers?seller_id=${sellerId}`
    : `${process.env.BACKEND_URL}/api/v1/seller/flowers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch flowers');
  return await res.json();
}
