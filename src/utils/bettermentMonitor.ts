// Social Work Betterment & Non-Profit Monitoring Engine
// Ensures all community initiatives strictly serve the betterment of people and society,
// and strictly forbids individual or commercial profit.

export interface BettermentInspectionResult {
  isApproved: boolean;
  bettermentScore: number; // 0 - 100
  profitRisk: 'zero' | 'low' | 'high_risk_flagged';
  detectedBeneficiary: string;
  flaggedKeywords: string[];
  publicBenefitQuality: 'exemplary' | 'solid' | 'needs_clarity';
  issues: string[];
  guidance: string[];
}

// Commercial / Individual Profit Prohibition Lexicon
const COMMERCIAL_PROFIT_KEYWORDS = [
  'entry fee',
  'ticket price',
  'admission fee',
  'ticket cost',
  'registration fee',
  'paid entry',
  'buy ticket',
  'purchase pass',
  'buy now',
  'for sale',
  'selling',
  'merchandise sale',
  'discount code',
  'coupon',
  'crypto',
  'cryptocurrency',
  'bitcoin',
  'ethereum',
  'nft',
  'invest now',
  'roi',
  'guaranteed return',
  'mlm',
  'network marketing',
  'pyramid',
  'affiliate link',
  'monetize',
  'commercial promotion',
  'sponsor product',
  'brand endorsement',
  'hire for company',
  'commercial client',
  'personal profit',
  'profit share',
  'commission rate',
  'charge per hour',
  'consultancy fee',
  'pay to attend',
  'business marketing',
  'sales pitch',
  'charge money',
];

// Societal Betterment & Humanitarian Markers
const SOCIETAL_BETTERMENT_MARKERS = [
  'community',
  'society',
  'public',
  'people',
  'elderly',
  'children',
  'kids',
  'youth',
  'slum',
  'underprivileged',
  'marginalized',
  'animals',
  'stray',
  'dogs',
  'cats',
  'environment',
  'nature',
  'clean',
  'cleanup',
  'restore',
  'tree',
  'planting',
  'water',
  'river',
  'lake',
  'canal',
  'ocean',
  'beach',
  'plastic',
  'waste',
  'food',
  'meal',
  'hunger',
  'ration',
  'literacy',
  'education',
  'library',
  'school',
  'books',
  'health',
  'medical',
  'first aid',
  'wheelchair',
  'accessibility',
  'safety',
  'women safety',
  'welfare',
  'free',
  'volunteer',
  'donation',
  'charity',
  'civic',
  'neighborhood',
  'sanitation',
  'hygiene',
  'beautify',
  'park',
  'garden',
];

export const inspectSocialWorkInitiative = (
  title: string,
  categoryName: string,
  description: string,
  beneficiaryInput: string,
  publicBenefitStatement: string
): BettermentInspectionResult => {
  const combinedText = `${title} ${categoryName} ${description} ${beneficiaryInput} ${publicBenefitStatement}`.toLowerCase();

  const flaggedKeywords: string[] = [];
  const issues: string[] = [];
  const guidance: string[] = [];

  // 1. Scan for commercial / profit exploitation
  for (const term of COMMERCIAL_PROFIT_KEYWORDS) {
    if (combinedText.includes(term)) {
      flaggedKeywords.push(term);
    }
  }

  // 2. Count societal betterment signals
  let bettermentHits = 0;
  for (const marker of SOCIETAL_BETTERMENT_MARKERS) {
    if (combinedText.includes(marker)) {
      bettermentHits++;
    }
  }

  // 3. Determine profit risk
  let profitRisk: 'zero' | 'low' | 'high_risk_flagged' = 'zero';
  if (flaggedKeywords.length > 0) {
    profitRisk = 'high_risk_flagged';
    issues.push(
      `Commercial Profit Motive Detected: Identified prohibited commercial phrase(s) "${flaggedKeywords.join(
        '", "'
      )}". CleanMeet strictly bans events that generate individual or commercial revenue.`
    );
  }

  // 4. Beneficiary and Betterment Quality evaluation
  let detectedBeneficiary = beneficiaryInput.trim() || 'Local Society & Community';
  if (!beneficiaryInput.trim()) {
    if (combinedText.includes('animal') || combinedText.includes('dog') || combinedText.includes('cat')) {
      detectedBeneficiary = 'Stray Animals & Wildlife Welfare';
    } else if (combinedText.includes('elderly') || combinedText.includes('senior')) {
      detectedBeneficiary = 'Local Senior Citizens';
    } else if (combinedText.includes('child') || combinedText.includes('kid') || combinedText.includes('student') || combinedText.includes('slum')) {
      detectedBeneficiary = 'Underprivileged Children & Youth';
    } else if (combinedText.includes('nature') || combinedText.includes('tree') || combinedText.includes('plastic') || combinedText.includes('river')) {
      detectedBeneficiary = 'Public Ecology & Natural Environment';
    } else {
      detectedBeneficiary = 'Local Neighborhood & General Public';
    }
  }

  // 5. Calculate Societal Betterment Score (0-100)
  let score = 70; // baseline for attempting social work
  if (profitRisk === 'high_risk_flagged') {
    score = Math.max(10, 45 - flaggedKeywords.length * 15);
  } else {
    // Add points for rich betterment markers and clear benefit statement
    score += Math.min(20, bettermentHits * 2.5);
    if (publicBenefitStatement.trim().length > 30) {
      score += 10;
    }
    score = Math.min(100, Math.round(score));
  }

  const isApproved = profitRisk !== 'high_risk_flagged' && score >= 65 && combinedText.length > 25;

  let publicBenefitQuality: 'exemplary' | 'solid' | 'needs_clarity' = 'solid';
  if (score >= 90) publicBenefitQuality = 'exemplary';
  else if (score < 75) publicBenefitQuality = 'needs_clarity';

  if (!publicBenefitStatement.trim() || publicBenefitStatement.length < 20) {
    guidance.push('Add a clear statement of how this initiative improves the lives of people or society.');
  }

  if (profitRisk === 'zero') {
    guidance.push('Verified Non-Profit: Free from commercial monetization or ticket charges.');
  }

  return {
    isApproved,
    bettermentScore: score,
    profitRisk,
    detectedBeneficiary,
    flaggedKeywords,
    publicBenefitQuality,
    issues,
    guidance,
  };
};

export const SOCIAL_WORK_CAUSE_PRESETS = [
  {
    id: 'plastic_cleanup',
    name: 'Plastic Waste Cleanup',
    icon: 'Trash2',
    color: 'amber',
    beneficiary: 'Local Neighborhood & Marine Ecosystem',
    desc: 'Clearing single-use plastic, debris, and refuse from streets, parks, or coasts.',
  },
  {
    id: 'tree_planting',
    name: 'Urban Tree Plantation',
    icon: 'Trees',
    color: 'emerald',
    beneficiary: 'General Public & Climate Resilience',
    desc: 'Planting native shade saplings and expanding city green cover.',
  },
  {
    id: 'education_literacy',
    name: 'Education & Digital Literacy',
    icon: 'BookOpen',
    color: 'indigo',
    beneficiary: 'Underprivileged Children & Youth',
    desc: 'Free tutoring, community book drives, library setups, and basic digital literacy.',
  },
  {
    id: 'hunger_relief',
    name: 'Hunger Relief & Free Meals',
    icon: 'UtensilsCrossed',
    color: 'orange',
    beneficiary: 'Homeless Persons & Daily Wage Earners',
    desc: 'Surplus food rescue, community kitchen (langar), and fresh ration distribution.',
  },
  {
    id: 'animal_welfare',
    name: 'Stray Animal Welfare & Care',
    icon: 'Heart',
    color: 'rose',
    beneficiary: 'Stray Dogs, Cats & Urban Fauna',
    desc: 'Rabies vaccinations, reflective safety collars, fresh water bowls, and injured animal aid.',
  },
  {
    id: 'elderly_care',
    name: 'Senior Citizens Inclusion & Care',
    icon: 'Users',
    color: 'purple',
    beneficiary: 'Elderly Residents & Isolated Seniors',
    desc: 'Companionship walks, smartphone cyber-safety workshops, and medicine assistance.',
  },
  {
    id: 'waterbody_restore',
    name: 'Waterbody & Lake Restoration',
    icon: 'Droplets',
    color: 'blue',
    beneficiary: 'Local Neighborhood & Water Table',
    desc: 'De-weeding and de-clogging lakes, stormwater canals, and community ponds.',
  },
  {
    id: 'health_wellness',
    name: 'Free Public Health & Sanitation',
    icon: 'ShieldCheck',
    color: 'teal',
    beneficiary: 'Under-resourced Citizens & Slum Dwellers',
    desc: 'Free primary health screenings, hygiene kit distribution, and first-aid education.',
  },
  {
    id: 'civic_accessibility',
    name: 'Barrier-Free Civic Accessibility',
    icon: 'Building2',
    color: 'sky',
    beneficiary: 'Persons with Disabilities & Senior Pedestrians',
    desc: 'Installing wheelchair ramps, fixing damaged sidewalks, and tactile wayfinding.',
  },
  {
    id: 'neighborhood_beautify',
    name: 'Public Wall Art & Beautification',
    icon: 'Sparkles',
    color: 'violet',
    beneficiary: 'Local Community & Pedestrians',
    desc: 'Transforming garbage-dump corners into uplifting public murals and community gardens.',
  },
  {
    id: 'custom_cause',
    name: 'Custom Social Work Initiative',
    icon: 'Sparkles',
    color: 'emerald',
    beneficiary: 'Society & Public Good',
    desc: 'Freely name and define any genuine non-profit social cause for the betterment of society.',
  },
];
