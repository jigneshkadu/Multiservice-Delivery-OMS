
import { Order, OrderStatus, Vendor, Category, Banner, Rider, DeliveryTask, UserRequest, SiteVisit, Product, User, UserRole, AdminRole } from '../types';
import { APP_CATEGORIES, MOCK_VENDORS, INITIAL_BANNERS, MOCK_ORDERS } from '../constants';
import { checkFirestoreConnection } from './firebaseConfig';

// Mock data for reports
const MOCK_USER_REQUESTS: UserRequest[] = [
  { id: 'req_1', userId: 'u1', userName: 'John Doe', type: 'Support', status: 'PENDING', date: new Date().toISOString(), details: 'Need help with order #ORD-12345' },
  { id: 'req_2', userId: 'u2', userName: 'Jane Smith', type: 'Feedback', status: 'RESOLVED', date: new Date().toISOString(), details: 'Great service, keep it up!' }
];

const MOCK_SITE_VISITS: SiteVisit[] = [
  { id: 'v_1', date: new Date().toISOString(), page: 'Home', userId: 'u1', device: 'Mobile' },
  { id: 'v_2', date: new Date().toISOString(), page: 'Category: Food', userId: 'u2', device: 'Desktop' },
  { id: 'v_3', date: new Date().toISOString(), page: 'Vendor: Dahanu Sweets', device: 'Tablet' }
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: UserRole.USER, phone: '9876543210', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), lastLogin: new Date().toISOString(), purchases: MOCK_ORDERS.slice(0, 2), visitedCategories: ['cat_1', 'cat_2'] },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: UserRole.USER, phone: '9876543211', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), lastLogin: new Date().toISOString(), purchases: MOCK_ORDERS.slice(2, 3), visitedCategories: ['cat_3'] },
  { id: 'u3', name: 'Super Admin', email: 'admin@dahanu.com', role: UserRole.ADMIN, adminRole: AdminRole.SUPER_ADMIN, phone: '9876543212', createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), lastLogin: new Date().toISOString() },
  { id: 'u4', name: 'Vendor Admin', email: 'vendor_admin@dahanu.com', role: UserRole.ADMIN, adminRole: AdminRole.VENDOR_MANAGEMENT, phone: '9876543213', createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), lastLogin: new Date().toISOString() },
  { id: 'u5', name: 'Report Admin', email: 'report_admin@dahanu.com', role: UserRole.ADMIN, adminRole: AdminRole.REPORT_ADMIN, phone: '9876543214', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), lastLogin: new Date().toISOString() },
  { id: 'u6', name: 'User Admin', email: 'user_admin@dahanu.com', role: UserRole.ADMIN, adminRole: AdminRole.USER_MANAGEMENT, phone: '9876543215', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), lastLogin: new Date().toISOString() }
];

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Fetch failed for ${url}:`, error);
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

export const fetchUserRequests = async (): Promise<UserRequest[]> => {
  return fetchWithFallback(`${API_BASE}/user-requests`, MOCK_USER_REQUESTS);
};

export const fetchSiteVisits = async (): Promise<SiteVisit[]> => {
  return fetchWithFallback(`${API_BASE}/site-visits`, MOCK_SITE_VISITS);
};

export const fetchUsers = async (): Promise<User[]> => {
  return fetchWithFallback(`${API_BASE}/users`, MOCK_USERS);
};

export const fetchVendorSales = async (): Promise<any[]> => {
  // Mocking vendor sales data
  return MOCK_VENDORS.map(v => ({
    vendorId: v.id,
    vendorName: v.name,
    totalSales: Math.floor(Math.random() * 50000),
    orderCount: Math.floor(Math.random() * 100),
    contactCount: Math.floor(Math.random() * 50)
  }));
};

export const updateProduct = async (vendorId: string, productId: string, productData: Partial<Product>) => {
  try {
    const response = await fetch(`${API_BASE}/vendors/${vendorId}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await response.json();
  } catch (error) {
    return { success: true };
  }
};

export const fetchHealth = async (): Promise<{ status: string; dbConnected: boolean }> => {
  try {
    const healthUrl = `${API_BASE}/health`;
    console.log("Checking health at:", healthUrl);
    let response = await fetch(healthUrl);
    
    // If /api/health fails with 403 or 404, try root /health
    if (!response.ok && (response.status === 403 || response.status === 404)) {
      console.warn(`Health check at ${healthUrl} failed with ${response.status}, trying root /health`);
      response = await fetch('/health');
    }

    if (!response.ok) throw new Error(`Health check failed with status: ${response.status}`);
    const data = await response.json();
    console.log("Health check response:", data);
    return data;
  } catch (error) {
    console.error("Backend health check error:", error);
    // Fallback to firestore check only if backend fails
    const dbConnected = await checkFirestoreConnection();
    return { status: 'error', dbConnected };
  }
};
