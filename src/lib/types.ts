export type Activity =
  | 'education'
  | 'youth_mentoring'
  | 'at_risk_youth'
  | 'special_education'
  | 'disability_support'
  | 'agriculture'
  | 'nature_environment'
  | 'hiking'
  | 'community'
  | 'settlement'
  | 'art_culture'
  | 'social_entrepreneurship'
  | 'jewish_identity'
  | 'aliyah_integration'
  | 'medical_emergency'
  | 'sports'
  | 'coexistence';

export type Region = 'north' | 'haifa_valley' | 'center' | 'jerusalem' | 'lowlands' | 'south' | 'national';
export type Living = 'commune' | 'commuter' | 'youth_village' | 'boarding_facility' | 'mixed' | 'unknown';
export type Gender = 'mixed' | 'boys_only' | 'girls_only' | 'varies' | 'unknown';
export type FrameworkType = 'youth_movement' | 'settlement_movement' | 'social_organization' | 'other';
export type RegistrationStatus = 'open' | 'closed' | 'coming_soon' | 'unknown';
export type Confidence = 'high' | 'medium' | 'low';
export type SourceType = 'official' | 'government' | 'secondary';
export type Tri = boolean | 'unknown';

export interface Source {
  url: string;
  title: string;
  type: SourceType;
}

export interface Program {
  id: string;
  org: { name: string; website: string | null };
  name: string;
  tagline: string;
  description: string;
  framework_type: FrameworkType;
  activities: Activity[];
  regions: Region[];
  locations: string[];
  living: Living;
  gender: Gender;
  religious_character: string | null;
  membership_required: Tri;
  eligibility: string | null;
  nahal_option: Tri;
  program_url: string | null;
  registration_url: string | null;
  registration: {
    status: RegistrationStatus;
    open_date: string | null;
    deadline: string | null;
  };
  stipend: string | null;
  selection: string | null;
  contact: { phone: string | null; email: string | null };
  sources: Source[];
  verified_at: string;
  confidence: Confidence;
  gaps: string | null;
}

export interface OtherFramework {
  name: string;
  url: string | null;
  link_label?: string;
  note: string | null;
}

export interface Fact {
  topic: string;
  text: string;
  source_url: string;
  source_title: string;
}
