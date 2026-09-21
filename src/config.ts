// Application configuration and API keys

export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyBTBo0nHitwBGiJuTPSsClj1h8d083ESK4';

export const DEFAULT_USER_LOCATION = {
  lat: 19.0760,
  lng: 72.8777, // Default reference city location (e.g. coastal urban area)
  address: 'Bandra West, Hill Road',
  city: 'Mumbai',
};

export const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; bg: string; borderColor: string }
> = {
  plastic_cleanup: {
    label: 'Plastic Waste Cleanup',
    icon: 'Trash2',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  tree_planting: {
    label: 'Urban Tree Plantation',
    icon: 'Trees',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  beach_cleanup: {
    label: 'Beach & Shoreline Sweep',
    icon: 'Waves',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  neighborhood_beautify: {
    label: 'Public Murals & Beautification',
    icon: 'Sparkles',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  waterbody_restore: {
    label: 'Canal & Lake De-clogging',
    icon: 'Droplets',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  urban_greening: {
    label: 'Urban Micro-Foresting',
    icon: 'Sprout',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  education_literacy: {
    label: 'Education & Digital Literacy',
    icon: 'BookOpen',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  hunger_relief: {
    label: 'Hunger Relief & Free Meals',
    icon: 'UtensilsCrossed',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  animal_welfare: {
    label: 'Stray Animal Care & Welfare',
    icon: 'Heart',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  elderly_care: {
    label: 'Elderly Care & Inclusion',
    icon: 'Users',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  health_wellness: {
    label: 'Free Public Health & Sanitation',
    icon: 'ShieldCheck',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  civic_accessibility: {
    label: 'Barrier-Free Accessibility',
    icon: 'Building2',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  custom_cause: {
    label: 'Custom Social Work Cause',
    icon: 'Sparkles',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

export const getCategoryMeta = (category: string, customName?: string) => {
  if (customName && customName.trim()) {
    return {
      label: customName.trim(),
      icon: 'Sparkles',
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    };
  }

  return (
    CATEGORY_META[category] || {
      label: category ? category.replace(/_/g, ' ') : 'Social Work',
      icon: 'HeartHandshake',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    }
  );
};
