// Core domain types for service year (שנת שירות) platform

export type VerificationStatus = 'verified' | 'partially_verified' | 'needs_review' | 'stale';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';
export type SourceType = 'official' | 'official_registration_page' | 'social_media' | 'news' | 'aggregator' | 'user_report';
export type FrameworkType = 'youth_movement' | 'settlement_movement' | 'social_organization' | 'nature_education' | 'sports' | 'religious' | 'other';
export type ActivityCategory = 'education' | 'youth_mentoring' | 'at_risk_youth' | 'special_education' | 'disability_support' | 'agriculture' | 'nature_environment' | 'hiking' | 'community' | 'settlement' | 'art_culture' | 'social_entrepreneurship' | 'jewish_identity' | 'aliyah_integration' | 'medical_emergency' | 'other';
export type Region = 'north' | 'haifa_valley' | 'center' | 'jerusalem' | 'lowlands' | 'south' | 'national';
export type LivingArrangement = 'commune' | 'commuter' | 'youth_village' | 'boarding_facility' | 'unknown';
export type GenderStructure = 'mixed' | 'boys_only' | 'girls_only' | 'unknown';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  official_website: string;
  logo_url?: string;
  logo_license?: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  framework_type: FrameworkType;
  short_description: string;
  full_description: string;
  activity_categories: ActivityCategory[];
  requires_movement_membership: boolean;
  open_to_non_members: boolean;
  gender_structure: GenderStructure;
  living_arrangement: LivingArrangement;
  has_nahal_option: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramCycle {
  id: string;
  program_id: string;
  year: string; // e.g., "2026-2027"
  cycle_status: 'open' | 'closed' | 'coming_soon' | 'unknown';
  registration_status: 'open' | 'closed' | 'coming_soon' | 'unknown';
  registration_url?: string;
  application_open_date?: string;
  application_deadline?: string;
  selection_process?: string;
  selection_dates?: string[];
  cost?: number;
  cost_currency?: string;
  financial_support?: string;
  number_of_communes?: number;
  expected_participants?: number;
  cycle_notes?: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  region: Region;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramLocation {
  id: string;
  program_cycle_id: string;
  location_id: string;
  location_type: 'main' | 'secondary' | 'optional';
  notes?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  source_type: SourceType;
  is_official: boolean;
  published_at?: string;
  retrieved_at: string;
  created_at: string;
}

export interface ProgramSource {
  id: string;
  program_id: string;
  program_cycle_id?: string;
  source_id: string;
  notes?: string;
  created_at: string;
}

export interface ReligiousDetails {
  program_id: string;
  program_cycle_id?: string;
  religious_character?: string | 'unknown'; // e.g., "Orthodox", "Religious-Zionist", "Secular", etc. Only if explicitly stated
  shabbat_observed?: boolean | 'unknown';
  kashrut?: boolean | 'unknown';
  prayers?: boolean | 'unknown';
  mixed_gender_groups?: boolean | 'unknown';
  source_id?: string; // Reference to the source where this was stated
  verified_at?: string;
  confidence: ConfidenceLevel;
}

export interface Report {
  id: string;
  program_id?: string;
  type: 'incorrect_info' | 'missing_info' | 'registration_link_broken' | 'outdated' | 'other';
  message: string;
  submitted_by_email?: string; // Only if user provides it
  created_at: string;
  status: 'open' | 'triaged' | 'resolved' | 'invalid';
  admin_notes?: string;
  updated_at: string;
}

export interface FieldEvidence {
  id: string;
  entity_type: 'program' | 'program_cycle' | 'organization';
  entity_id: string;
  field_name: string;
  source_id: string;
  verified_at: string;
  confidence: ConfidenceLevel;
  evidence_value?: string; // The actual value that was found
}

export interface SearchResult {
  program_id: string;
  organization_name: string;
  program_name: string;
  short_description: string;
  match_score: number;
  matched_fields: string[]; // e.g., ["name", "description", "organization"]
}

export interface ComparisonSelection {
  program_id: string;
  program_cycle_year: string;
}

// ReligiousLifestyleFilter represents what a user wants to know/prioritize
export interface ReligiousLifestylePreference {
  priority_level: 'not_important' | 'nice_to_have' | 'essential';
  shabbat_observance?: boolean;
  kashrut?: boolean;
  separate_genders?: boolean;
  jewish_values?: boolean;
}

export interface UserPreferences {
  activity_categories?: ActivityCategory[];
  regions?: Region[];
  religious_lifestyle?: ReligiousLifestylePreference;
  target_population?: string[];
  allow_nahal?: boolean;
}
