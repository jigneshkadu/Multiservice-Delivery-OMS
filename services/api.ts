
import { Order, OrderStatus, Vendor, Category, Banner, Rider, DeliveryTask } from '../types';
import { APP_CATEGORIES, MOCK_VENDORS, INITIAL_BANNERS, MOCK_ORDERS } from '../constants';

const API_BASE = 'http://localhost:5000/api';

async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return fallbackData;
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  return fetchWithFallback(`${API_BASE}/categories`, APP_CATEGORIES);
};

export const fetchVendors = async (): Promise<Vendor[]> => {
  return fetchWithFallback(`${API_BASE}/vendors`, MOCK_VENDORS);
};

export const fetchBanners = async (): Promise<Banner[]> => {
  return fetchWithFallback(`${API_BASE}/banners`, INITIAL_BANNERS);
};

export const fetchRiders = async (): Promise<Rider[]> => {
  return fetchWithFallback(`${API_BASE}/riders`, []);
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  return fetchWithFallback(`${API_BASE}/orders`, MOCK_ORDERS);
};

export const assignRiderToOrder = async (orderId: string, riderId: string) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riderId })
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};

export const registerRider = async (riderData: Partial<Rider>) => {
  try {
    const response = await fetch(`${API_BASE}/riders/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riderData)
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};

export const updateRiderLocation = async (id: string, lat: number, lng: number) => {
  try {
    const response = await fetch(`${API_BASE}/riders/${id}/location`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng })
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};

export const updateRiderStatus = async (id: string, status: Rider['status']) => {
  try {
    const response = await fetch(`${API_BASE}/riders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    return { success: true, id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000) };
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};
