
import { Category, Vendor, Banner, Order } from './types';

export const APP_CATEGORIES: Category[] = [
  {
    id: 'dahanu_fresh',
    name: 'Dahanu Fresh',
    icon: 'Apple',
    description: 'Fresh fruits, vegetables and organic produce directly from farms.',
    themeColor: '#43A047', // Green
    subCategories: [
      { 
        id: 'fruits', 
        name: 'Fresh Fruits', 
        description: 'Seasonal and exotic fruits.',
        subCategories: [
            { id: 'seasonal_fruits', name: 'Seasonal Fruits' },
            { id: 'exotic_fruits', name: 'Exotic Fruits' }
        ]
      },
      { 
        id: 'vegetables', 
        name: 'Vegetables', 
        description: 'Daily fresh vegetables.',
        subCategories: [
            { id: 'daily_veggies', name: 'Daily Veggies' },
            { id: 'leafy_greens', name: 'Leafy Greens' }
        ]
      },
      { id: 'organic', name: 'Organic Produce', description: 'Certified organic farming products.' }
    ]
  },
  {
    id: 'dahanu_mart',
    name: 'Dahanu Mart',
    icon: 'ShoppingBasket',
    description: 'Groceries, daily essentials, and supermarket items delivered home.',
    themeColor: '#FF5722', // Deep Orange
    subCategories: [
      { id: 'daily_needs', name: 'Daily Essentials', description: 'Oil, Ghee, Masala, Rice, Flour.' },
      { id: 'snacks', name: 'Snacks & Beverages', description: 'Biscuits, Chips, Cold Drinks, Juices.' },
      { id: 'personal_care', name: 'Personal Care', description: 'Soaps, Shampoos, Lotions, Hygiene.' },
      { id: 'cleaning', name: 'Household & Cleaning', description: 'Detergents, Cleaners, Disposables.' }
    ]
  },
  {
    id: 'events',
    name: 'Events Services',
    icon: 'PartyPopper',
    description: 'Everything you need for your special occasions.',
    themeColor: '#9C27B0', // Purple (Rainbow: Violet)
    subCategories: [
      { 
        id: 'event_planning', 
        name: 'Event Planning', 
        description: 'Comprehensive planning for corporate and private events.',
        subCategories: [
          { id: 'decorators', name: 'Decorators' },
          { id: 'dj', name: 'DJ & Orchestra' },
          { id: 'event_mgmt', name: 'Event Management' }
        ]
      },
      { 
        id: 'catering', 
        name: 'Catering & Food', 
        description: 'High-quality catering, bakery and confectionery services.',
        subCategories: [
          { id: 'cat_service', name: 'Catering' },
          { id: 'bakery', name: 'Bakery' },
          { id: 'confectionery', name: 'Confectionery' }
        ]
      },
      { 
        id: 'lighting', 
        name: 'Lighting & Decor',
        description: 'Professional lighting setups for all types of events.'
      }
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Health',
    icon: 'Stethoscope',
    description: 'Healthcare services, clinics, and emergency support.',
    themeColor: '#2196F3', // Blue (Rainbow: Blue)
    subCategories: [
      { 
        id: 'hospitals', 
        name: 'Hospitals & Clinics', 
        description: 'General hospitals, dental clinics, and specialists.',
        subCategories: [
          { id: 'hospital', name: 'Hospitals' },
          { id: 'clinic', name: 'Clinics' },
          { id: 'dentist', name: 'Dentists' },
          { id: 'skin', name: 'Skin Specialist' }
        ]
      },
      { 
        id: 'diagnostics', 
        name: 'Diagnostics', 
        description: 'Pathology labs, MRI, Sonography and imaging centers.',
        subCategories: [
          { id: 'sono', name: 'Sonography' },
          { id: 'mri', name: 'MRI' }
        ]
      },
      { id: 'pharmacy', name: 'Pharmacies', description: '24/7 Medical stores and pharmacies.' },
      { id: 'vet', name: 'Veterinary', description: 'Care for your pets and animals.' },
      { id: 'nursing', name: 'Nursing & Home Care', description: 'Professional nursing and patient care at home.' },
      { id: 'ambulance', name: 'Ambulance', description: 'Emergency transport services.' },
      { id: 'bloodbank', name: 'Blood Banks', description: 'Blood storage and donation centers.' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'Truck',
    description: 'Logistics, travel agencies, and vehicle rentals.',
    themeColor: '#FF9800', // Orange (Rainbow: Orange)
    subCategories: [
      { 
        id: 'passenger', 
        name: 'Passenger Transport', 
        description: 'Buses, private cars, and travel agents for your journey.',
        subCategories: [
          { id: 'private_car', name: 'Private Cars' },
          { id: 'bus', name: 'Buses' },
          { id: 'travel_agent', name: 'Travel Agents' }
        ]
      },
      { 
        id: 'goods', 
        name: 'Goods Delivery', 
        description: 'Heavy duty trucks, tempos and pickup services.',
        subCategories: [
          { id: 'heavy', name: 'Heavy Duty' },
          { id: 'tempo', name: 'Small Tempos' },
          { id: 'pickup', name: 'Pickup Services' }
        ]
      },
      { 
        id: 'auto_service', 
        name: 'Automobile Services', 
        description: 'Repair, washing, and maintenance for your vehicles.',
        subCategories: [
          { id: 'car_service', name: 'Car Service' },
          { id: 'bike_service', name: 'Bike Service' },
          { id: 'washing', name: 'Washing Center' },
          { id: 'puncture', name: 'Tyre & Puncture' }
        ]
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: 'Sparkles',
    description: 'Salons, spas, and fitness centers.',
    themeColor: '#E91E63', // Pink (Requested)
    subCategories: [
      { 
        id: 'fitness', 
        name: 'Fitness', 
        description: 'Gyms, yoga classes, and zumba centers.',
        subCategories: [
          { id: 'gym', name: 'Gym' },
          { id: 'yoga', name: 'Yoga' },
          { id: 'zumba', name: 'Zumba' }
        ]
      },
      { 
        id: 'salon', 
        name: 'Salons & Spas', 
        description: 'Beauty parlours, hair salons, and massage therapies.',
        subCategories: [
          { id: 'beauty_parlour', name: 'Beauty Parlour' },
          { id: 'massage', name: 'Spa & Massage' }
        ]
      }
    ]
  },
  {
    id: 'home',
    name: 'Home & Maintenance',
    icon: 'Hammer',
    description: 'Repairs, renovations, and handyman services.',
    themeColor: '#4CAF50', // Green (Rainbow: Green)
    subCategories: [
      { 
        id: 'handyman', 
        name: 'Handyman', 
        description: 'Plumbers, electricians, and carpenters.',
        subCategories: [
          { id: 'plumber', name: 'Plumber' },
          { id: 'electrician', name: 'Electrician' },
          { id: 'carpenter', name: 'Carpenter' }
        ]
      },
      { id: 'interior', name: 'Interior Design', description: 'Make your home beautiful with expert designers.' },
      { 
        id: 'appliance', 
        name: 'Appliance Repair', 
        description: 'Repair services for AC, fridge, ovens, and more.',
        subCategories: [
          { id: 'ac_repair', name: 'AC & Fridge' },
          { id: 'oven', name: 'Oven & Mixer' }
        ]
      },
      { 
        id: 'electronic', 
        name: 'Electronic Repair', 
        description: 'Fixing laptops, computers, and mobile phones.',
        subCategories: [
          { id: 'laptop', name: 'Laptop/PC' },
          { id: 'phone', name: 'Mobile Phone' }
        ]
      }
    ]
  },
  {
    id: 'housekeeping',
    name: 'Housekeeping',
    icon: 'SprayCan',
    description: 'Maids, cooks, and daily utility supplies.',
    themeColor: '#009688', // Teal
    subCategories: [
      { 
        id: 'domestic', 
        name: 'Domestic Help', 
        description: 'Find maids, cooks, and house servants.',
        subCategories: [
          { id: 'maid', name: 'Maids & Cooks' },
          { id: 'servant', name: 'House Servant' }
        ]
      },
      { 
        id: 'daily_needs', 
        name: 'Daily Needs', 
        description: 'Milk, water supply, and security personnel.',
        subCategories: [
          { id: 'milk', name: 'Milk Supply' },
          { id: 'water', name: 'Water Supply' },
          { id: 'watchman', name: 'Watchman' }
        ]
      }
    ]
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: 'Utensils',
    description: 'Restaurants, cafes, and street food.',
    themeColor: '#F44336', // Red (Rainbow: Red)
    subCategories: [
      { id: 'restaurant', name: 'Restaurants', description: 'Dine-in and delivery options.' },
      { id: 'beverage', name: 'Beverages', description: 'Cafes, tea stalls, and juice bars.' }
    ]
  },
  {
    id: 'accom',
    name: 'Accommodation',
    icon: 'Hotel',
    description: 'Hotels, lodges, and guest houses.',
    themeColor: '#FFC107', // Amber (Rainbow: Yellow)
    subCategories: [
      { id: 'hotel', name: 'Hotels', description: 'Comfortable stays and lodgings.' },
      { id: 'agro', name: 'Agro Tourism', description: 'Experience farm life and nature.' }
    ]
  }
];

export const INITIAL_BANNERS: Banner[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', link: '#', altText: 'Dahanu Fresh Chikoos' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', link: '#', altText: 'Best Seafood in Town' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', link: '#', altText: 'Emergency Medical Services' },
];

export const MOCK_VENDORS: Vendor[] = [
  // --- HOSPITALS & CLINICS ---
  {
    id: 'med_gov_1',
    name: 'Sub District Hospital (Cottage)',
    categoryIds: ['hospitals', 'ambulance', 'medical'],
    description: 'Government hospital providing emergency and general healthcare services. Trauma care available.',
    rating: 4.0,
    location: { lat: 19.9720, lng: 72.7150, address: 'Seaface Road, Dahanu West' },
    contact: '02528-222222',
    maskedContact: '02528 22****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b9af953?auto=format&fit=crop&w=300&q=80',
    priceStart: 0,
    supportsDelivery: false
  },
  {
    id: 'med_pvt_1',
    name: 'Ashirwad Nursing Home',
    categoryIds: ['hospitals', 'medical', 'nursing'],
    description: 'Multispeciality hospital with Maternity and Surgical care.',
    rating: 4.6,
    location: { lat: 19.9735, lng: 72.7320, address: 'Irani Road, Dahanu East' },
    contact: '+919922001122',
    maskedContact: '+91 99220 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=300&q=80',
    priceStart: 500,
    supportsDelivery: false
  },
  {
    id: 'med_eye_1',
    name: 'Dahanu Eye Hospital',
    categoryIds: ['hospitals', 'clinic', 'medical'],
    description: 'Specialized eye care centre, cataract surgeries.',
    rating: 4.8,
    location: { lat: 19.9750, lng: 72.7300, address: 'Masoli, Dahanu' },
    contact: '+919822334455',
    maskedContact: '+91 98223 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
    priceStart: 300,
    supportsDelivery: false
  },
  {
    id: 'med_dent_1',
    name: 'Dr. Shah Dental Care',
    categoryIds: ['dentist', 'clinic', 'medical'],
    description: 'Advanced dental treatments, root canals, and implants.',
    rating: 4.9,
    location: { lat: 19.9765, lng: 72.7290, address: 'Station Road, Dahanu East' },
    contact: '+919000000002',
    maskedContact: '+91 90000 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f72?auto=format&fit=crop&w=300&q=80',
    priceStart: 200,
    supportsDelivery: false
  },
  {
    id: 'med_diag_1',
    name: 'Care Diagnostic Centre',
    categoryIds: ['diagnostics', 'medical'],
    description: 'Pathology, X-Ray, Sonography and ECG.',
    rating: 4.3,
    location: { lat: 19.9740, lng: 72.7310, address: 'Near Railway Station, Dahanu' },
    contact: '+919890000003',
    maskedContact: '+91 98900 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=300&q=80',
    priceStart: 150,
    supportsDelivery: false
  },
  {
    id: 'med_phar_1',
    name: 'Sanjeevani Medical Store',
    categoryIds: ['pharmacy', 'medical'],
    description: '24/7 Chemist and druggist. Free home delivery nearby.',
    rating: 4.5,
    location: { lat: 19.9710, lng: 72.7180, address: 'Main Market, Dahanu West' },
    contact: '+919890000004',
    maskedContact: '+91 98900 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=300&q=80',
    priceStart: 10,
    supportsDelivery: true,
    products: [
        { name: 'Paracetamol Strip', price: 20 },
        { name: 'Cough Syrup', price: 85 },
        { name: 'First Aid Kit', price: 250 },
        { name: 'Thermometer', price: 150 }
    ]
  },

  // --- FOOD & RESTAURANTS ---
  {
    id: 'fd_1',
    name: 'Crazy Crab Restaurant',
    categoryIds: ['restaurant', 'beverage', 'food'],
    description: 'Famous for seafood and seaside dining experience. Must try: Crab Masala.',
    rating: 4.7,
    location: { lat: 19.9680, lng: 72.7100, address: 'Dahanu Beach' },
    contact: '02528-223344',
    maskedContact: '02528 22****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
    priceStart: 300,
    supportsDelivery: true,
    products: [
        { name: 'Crab Masala', price: 450, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&q=80' },
        { name: 'Pomfret Fry', price: 350, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=200&q=80' },
        { name: 'Veg Thali', price: 150 }
    ]
  },
  {
    id: 'fd_2',
    name: 'Hotel Shetkar',
    categoryIds: ['restaurant', 'food'],
    description: 'Authentic Maharashtrian Thali and non-veg delicacies.',
    rating: 4.2,
    location: { lat: 19.9760, lng: 72.7330, address: 'Near Flyover, Dahanu East' },
    contact: '+919988776655',
    maskedContact: '+91 99887 *****',
    isVerified: false,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
    priceStart: 120,
    supportsDelivery: true,
    products: [
        { name: 'Chicken Thali', price: 200 },
        { name: 'Mutton Bhakri', price: 250 },
        { name: 'Pithla Bhakri', price: 120 }
    ]
  },
  {
    id: 'fd_3',
    name: 'Beach Classic Restaurant',
    categoryIds: ['restaurant', 'beverage', 'food'],
    description: 'Garden restaurant with sea view. Chinese and Indian cuisine.',
    rating: 4.4,
    location: { lat: 19.9690, lng: 72.7110, address: 'Seaface, Dahanu' },
    contact: '02528-224455',
    maskedContact: '02528 22****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80',
    priceStart: 180,
    supportsDelivery: true
  },

  // --- ACCOMMODATION ---
  {
    id: 'ht_1',
    name: 'Pearline Beach Resort',
    categoryIds: ['hotel', 'agro', 'accom'],
    description: 'Luxury stay near the beach with swimming pool and AC rooms.',
    rating: 4.5,
    location: { lat: 19.9650, lng: 72.7120, address: 'Agar, Dahanu' },
    contact: '+919922334455',
    maskedContact: '+91 99223 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    priceStart: 2500,
    supportsDelivery: false
  },
  {
    id: 'ht_2',
    name: 'Save Farm',
    categoryIds: ['agro', 'accom', 'dahanu_fresh'],
    description: 'Authentic agro-tourism experience. Stay in nature, organic food.',
    rating: 4.8,
    location: { lat: 20.0100, lng: 72.7600, address: 'Gholvad, Dahanu' },
    contact: '02528-241130',
    maskedContact: '02528 24****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80',
    priceStart: 1500,
    supportsDelivery: false
  },

  // --- FRESH & MART ---
  {
    id: 'fr_1',
    name: 'Dahanu Organic Farms',
    categoryIds: ['dahanu_fresh', 'fruits', 'organic'],
    description: 'Famous Gholvad Chikoos, Mangoes and Neera.',
    rating: 4.9,
    location: { lat: 20.0050, lng: 72.7550, address: 'Bordi Road' },
    contact: '+919800099999',
    maskedContact: '+91 98000 *****',
    isVerified: true,
    isApproved: true,
    supportsDelivery: true,
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=300&q=80',
    priceStart: 60,
    products: [
        { name: 'Dahanu Chikoo (1kg)', price: 60, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=200&q=80' },
        { name: 'Kesar Mango (1 Dozen)', price: 800 },
        { name: 'Fresh Neera (1L)', price: 100 }
    ]
  },
  {
    id: 'mt_1',
    name: 'Dahanu Super Mart',
    categoryIds: ['dahanu_mart', 'daily_needs', 'snacks'],
    description: 'One stop shop for all grocery needs.',
    rating: 4.3,
    location: { lat: 19.9750, lng: 72.7350, address: 'Main Market, Dahanu East' },
    contact: '+919888877777',
    maskedContact: '+91 98888 *****',
    isVerified: true,
    isApproved: true,
    supportsDelivery: true,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    priceStart: 20,
    products: [
      { name: 'Sunflower Oil (1L)', price: 140 },
      { name: 'Basmati Rice (1kg)', price: 90 },
      { name: 'Sugar (1kg)', price: 42 }
    ]
  },

  // --- SERVICES (Events, Transport, Home) ---
  {
    id: 'ev_1',
    name: 'Royal Celebrations Hall',
    categoryIds: ['events', 'event_planning', 'decorators'],
    description: 'Spacious AC hall for weddings, birthdays and corporate events.',
    rating: 4.4,
    location: { lat: 19.9800, lng: 72.7400, address: 'Kosbad Road' },
    contact: '+919000000001',
    maskedContact: '+91 90000 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80',
    priceStart: 15000,
    supportsDelivery: false
  },
  {
    id: 'tr_1',
    name: 'Om Sai Travels',
    categoryIds: ['transport', 'private_car', 'bus'],
    description: 'Car rentals, Bus booking for Mumbai/Gujarat.',
    rating: 4.2,
    location: { lat: 19.9745, lng: 72.7315, address: 'Near Bus Stand, Dahanu' },
    contact: '+919998887776',
    maskedContact: '+91 99988 *****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80',
    priceStart: 1500,
    supportsDelivery: false
  },
  {
    id: 'rep_1',
    name: 'Dahanu Auto Garage',
    categoryIds: ['transport', 'auto_service', 'puncture'],
    description: 'Two wheeler and four wheeler repair, puncture and washing.',
    rating: 4.1,
    location: { lat: 19.9730, lng: 72.7250, address: 'Parnaka, Dahanu' },
    contact: '+917777777777',
    maskedContact: '+91 77777 *****',
    isVerified: false,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1597500746977-2c974c0b4629?auto=format&fit=crop&w=300&q=80',
    priceStart: 50,
    supportsDelivery: false
  },
  {
    id: 'edu_1',
    name: 'St. Mary\'s High School',
    categoryIds: ['home'], // Using 'home' as a fallback since education isn't a primary cat
    description: 'Reputed educational institution in Dahanu.',
    rating: 4.8,
    location: { lat: 19.9725, lng: 72.7200, address: 'Dahanu Road' },
    contact: '02528-222100',
    maskedContact: '02528 22****',
    isVerified: true,
    isApproved: true,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80',
    priceStart: 0,
    supportsDelivery: false
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    vendorId: 'ev_1',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    serviceRequested: 'Wedding Decoration',
    date: '2024-05-15',
    status: 'PENDING',
    address: 'Plot 45, Green Valley, Dahanu',
    // Fix: Using total_amount instead of amount to match Order interface
    total_amount: 15000
  },
  {
    id: 'o2',
    vendorId: 'fd_1',
    customerName: 'Priya Patel',
    customerPhone: '9876543211',
    serviceRequested: 'Seafood Platter',
    date: '2024-05-18',
    status: 'ACCEPTED',
    address: '101, Ocean View Apts, Dahanu',
    // Fix: Using total_amount instead of amount to match Order interface
    total_amount: 1200
  }
];
