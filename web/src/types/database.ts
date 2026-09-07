export type AppRole = "customer" | "master" | "admin"
export type MasterStatus = "pending" | "active" | "rejected" | "deactivated"
export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled"

export interface Profile {
  id: string
  role: AppRole
  master_status: MasterStatus | null
  full_name: string | null
  phone: string | null
  bio: string | null
  trade: string | null
  city: string | null
  plz: string | null
  latitude: number | null
  longitude: number | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  master_id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  created_at: string
}

export interface Booking {
  id: string
  master_id: string
  customer_id: string
  service_id: string | null
  start_at: string
  end_at: string
  status: BookingStatus
  customer_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WorkingHours {
  id: string
  master_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface RegionCenter {
  id: string
  name: string
  latitude: number
  longitude: number
  max_radius_km: number
}