export type Guest = {
  id: string;
  public_id: string;
  token_version: number;
  token_revoked_at?: string | null;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  meal_preference?: string | null;
  allergy_notes?: string | null;
  special_needs?: string | null;
  plus_ones_allowed: number;
  children_count: number;
  notes?: string | null;
  rsvp_status?: 'pending' | 'attending' | 'not_attending' | 'undecided' | null;
  created_at: string;
  tokenUrl?: string | null;
};
