export type DriveCategory = 
  | 'plastic_cleanup' 
  | 'tree_planting' 
  | 'beach_cleanup' 
  | 'neighborhood_beautify' 
  | 'waterbody_restore' 
  | 'urban_greening'
  | 'education_literacy'
  | 'hunger_relief'
  | 'animal_welfare'
  | 'elderly_care'
  | 'health_wellness'
  | 'civic_accessibility'
  | 'custom_cause'
  | string;

export type DriveStatus = 'recruiting' | 'in_progress' | 'completed';

export interface BettermentDetails {
  publicBenefitStatement: string; // How this work improves people's lives and society
  zeroProfitCertified: boolean; // Certified strictly zero individual or commercial profit
  bettermentScore: number; // e.g. 95-100%
  beneficiaryGroup: string; // Who directly benefits (e.g. Underprivileged Students, Stray Dogs, Seniors)
  monitoringStatus: 'verified_betterment' | 'under_audit' | 'community_flagged';
  flagsCount?: number;
  flagReports?: Array<{
    reportedBy: string;
    reason: string;
    timestamp: string;
    details: string;
  }>;
  auditNotes?: string[];
  auditTimestamp?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  email: string;
  phone?: string;
  city: string;
  totalHours: number;
  drivesCompleted: number;
  drivesOrganized: number;
  badges: AwardedBadge[];
  searchRadiusKm?: number; // User chosen search distance (maximum 50 km)
  hasConfiguredRadius?: boolean; // Tracks if user has selected their distance
  locationCoords?: { lat: number; lng: number; label?: string };
}

export interface VolunteerAttendee {
  userId: string;
  name: string;
  avatar: string;
  role: string; // e.g. "Logistics Lead", "Waste Sorter", "General Volunteer"
  joinedAt: string;
  status: 'registered' | 'en_route' | 'arrived' | 'work_done';
  currentLocation?: { lat: number; lng: number };
  hoursLogged?: number;
}

export interface WomenSafetyDetails {
  guaranteed: boolean;
  safetyLeadName: string;
  safetyLeadContact: string;
  daylightOnly: boolean;
  buddySystemEnforced: boolean;
  safeRestroomsNearby: boolean;
  publicTransitDistance: string;
  emergencyFirstAidKit: boolean;
  policeStationNearby?: string;
}

export interface DriveLocation {
  address: string;
  landmark: string;
  city: string;
  lat: number;
  lng: number;
}

export interface AwardedBadge {
  id: string;
  driveId: string;
  driveTitle: string;
  badgeTitle: string;
  badgeType: 'gold' | 'silver' | 'green' | 'bronze';
  icon: string;
  hoursContributed: number;
  dateAwarded: string;
  issuedTo: string;
  credentialId: string;
  skills: string[];
}

export interface SocialDrive {
  id: string;
  title: string;
  category: DriveCategory;
  customCategoryName?: string; // Freely defined and named by the poster
  beneficiaryGroup?: string; // Direct beneficiaries of the initiative
  description: string;
  
  // Non-profit & Societal Betterment Monitoring
  bettermentDetails?: BettermentDetails;
  
  // Visual evidence
  beforePhotoUrl: string; // Mandatory 1 photo posted by creator showing need for cleaning or social intervention
  afterPhotoUrl?: string; // Posted after work is completed
  
  // Creator
  organizer: UserProfile;
  createdAt: string;
  
  // Time and Daytime enforcement
  date: string;
  startTime: string; // e.g., "08:30"
  endTime: string;   // e.g., "12:00"
  isDaytime: boolean; // Must be during daytime
  targetHours: number; // e.g. 3.5 hours
  deadlineTime: string; // e.g. "Today before 1:00 PM"
  
  // Location & Map
  location: DriveLocation;
  
  // Volunteers & Safety
  volunteersNeeded: number;
  volunteersJoined: VolunteerAttendee[];
  womenSafety: WomenSafetyDetails;
  
  // Equipment & logistics
  equipmentProvided: string[];
  whatToBring: string[];
  
  // Work Tracking & Status
  status: DriveStatus;
  workStartedAt?: string;
  workFinishedAt?: string;
  actualWorkHours?: number;
  completionNotes?: string;
  
  // Impact results (Diverse community outcomes)
  impactSummary?: {
    plasticKg?: number;
    bagsFilled?: number;
    treesPlanted?: number;
    areaCleanedSqM?: number;
    mealsServed?: number;
    studentsTutored?: number;
    animalsTreated?: number;
    seniorsAssisted?: number;
    booksDistributed?: number;
    customImpactMetric?: string;
  };
}

export interface ChatMessage {
  id: string;
  driveId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string; // 'Organizer' | 'Safety Lead' | 'Volunteer' | 'System'
  text: string;
  timestamp: string;
  isSystemNotice?: boolean;
}

export interface GroupChatRoom {
  driveId: string;
  driveTitle: string;
  status: 'active' | 'archived_completed';
  createdAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
  participantsCount: number;
}

export interface InternalArchivedChatRecord {
  driveId: string;
  driveTitle: string;
  closedAt: string;
  reason: 'work_officially_completed';
  totalMessagesCount: number;
  participantsCount: number;
  encryptedTranscriptPayload: ChatMessage[];
  internalAuditHash: string;
  isInternalOnly: true; // Strictly internal database, unavailable to user
}
