
export enum UserRole {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  GUEST = 'GUEST'
}

export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
  icon?: string; 
  description?: string;
  themeColor?: string; 
  registrationFee?: number; 
}

export interface Product {
  name: string;
  price: number;
  image?: string; 
}

export interface Vendor {
  id: string;
  name: string;
  categoryIds: string[];
  description: string;
  rating: number;
  location: { lat: number; lng: number; address: string };
  contact: string; 
  maskedContact: string; 
  isVerified: boolean;
  isApproved: boolean; 
  imageUrl: string;
  promotionalBannerUrl?: string; 
  priceStart: number;
  email?: string;
  products?: Product[];
  supportsDelivery?: boolean; 
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'BIKE' | 'SCOOTER' | 'CYCLE';
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  location: { lat: number; lng: number };
  isApproved: boolean;
  rating: number;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  riderId: string;
  status: 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  pickupAddress: string;
  deliveryAddress: string;
  amount: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  altText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'REJECTED';

export interface Order {
  id: string;
  vendorId: string;
  vendorName?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  customerName: string;
  customerPhone: string;
  serviceRequested: string;
  date: string;
  status: OrderStatus;
  total_amount?: number;
  address: string;
}

export interface SystemConfig {
  smtpServer: string;
  port: string;
  username: string;
  password?: string;
  alertEmail: string;
  enableAlerts: boolean;
  pinnedVendorId?: string; 
}
