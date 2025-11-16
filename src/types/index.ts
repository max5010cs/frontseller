export interface Seller {
  id: string;
  telegram_id: number;
  shop_name: string;
  address: string;
  location_lat: number | null;
  location_lon: number | null;
}

export interface Flower {
  id: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  description?: string;
  status?: string;
  items?: string[];
  image_path: string;
}

export interface CustomRequest {
  id: string;
  buyer_telegram_id: number;
  buyer_name: string;
  image_url: string;
  prompt: string;
  items: string[];
  buyer_location_lat: number | null;
  buyer_location_lon: number | null;
  status: 'open' | 'accepted' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Bid {
  id: string;
  custom_request_id: string;
  seller_id: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  flower_id?: string;
  bouquet_id?: string;
  bid_id?: string;
  status: string;
  pickup_info?: string;
  price?: number;
  buyer_name?: string;
  image_url?: string;
  pickup_time?: string;
  created_at: string;
}
