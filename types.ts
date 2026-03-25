
export enum UserRole {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  GUEST = 'GUEST'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VENDOR_MANAGEMENT = 'VENDOR_MANAGEMENT',
  REPORT_ADMIN = 'REPORT_ADMIN',
  USER_MANAGEMENT = 'USER_MANAGEMENT'
}

export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
  icon?: string; 
  description?: string;
  themeColor?: string; 
  registrationFee?: number; 
  // parent_id added to support hierarchical navigation and fix TS compilation error in App.tsx
  parent_id?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string; 
}

export interface SiteVisit {
  id: string;
  date: string;
  page: string;
  userId?: string;
  device?: string;
}

export interface UserRequest {
  id: string;
  userId: string;
  userName: string;
  type: string;
  status: 'PENDING' | 'RESOLVED' | 'IN_PROGRESS';
  date: string;
  details: string;
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
  vehicleName?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  addressProofUrl?: string;
  licenseProofUrl?: string;
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
  adminRole?: AdminRole;
  phone?: string;
  address?: string;
  createdAt?: string;
  lastLogin?: string;
  purchases?: Order[];
  visitedCategories?: string[]; // Array of category IDs
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
