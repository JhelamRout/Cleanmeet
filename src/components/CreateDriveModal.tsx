import React, { useState, useMemo } from 'react';
import { SocialDrive, UserProfile, DriveCategory } from '../types';
import { SAMPLE_BEFORE_PHOTOS } from '../data/mockData';
import { DEFAULT_USER_LOCATION, CATEGORY_META } from '../config';
import { GoogleMapView } from './GoogleMapView';
import {
  inspectSocialWorkInitiative,
  SOCIAL_WORK_CAUSE_PRESETS,
} from '../utils/bettermentMonitor';
import {
  X,
  Upload,
  Camera,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Sun,
  AlertCircle,
  Check,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  FileCheck2,
  Info,
  BadgeCheck,
  BookOpen,
  UtensilsCrossed,
  Heart,
  Droplets,
  Trees,
  Trash2,
  Building2,
} from 'lucide-react';

interface CreateDriveModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onCreateDrive: (newDrive: SocialDrive) => void;
}

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({
  currentUser,
  onClose,
  onCreateDrive,
}) => {
  // Diverse Cause Selection & Custom Naming
  const [category, setCategory] = useState<DriveCategory>('education_literacy');
  const [customCategoryName, setCustomCategoryName] = useState<string>(
    'Youth Digital Literacy & Community Book Bank'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [beneficiaryGroup, setBeneficiaryGroup] = useState(
    'Underprivileged Children & Youth'
  );
  const [publicBenefitStatement, setPublicBenefitStatement] = useState(
    'Provides free digital literacy coaching and reading resources to low-income children at zero cost to families.'
  );

  // 1 photo requirement
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_BEFORE_PHOTOS[2]?.url || SAMPLE_BEFORE_PHOTOS[0].url);
  const [photoFileName, setPhotoFileName] = useState<string>('');

  // Location
  const [address, setAddress] = useState('Kala Killa Community Hall, 90 Feet Road');
  const [landmark, setLandmark] = useState('Near Sion Station West Junction');
  const [city, setCity] = useState('Mumbai');
  const [lat, setLat] = useState(19.0434);
  const [lng, setLng] = useState(72.8567);

  // Volunteers needed
  const [volunteersNeeded, setVolunteersNeeded] = useState(8);

  // Daytime & Duration
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:30');
  const [targetHours, setTargetHours] = useState(3.5);

  // Women Safety Guaranteed
  const [womenSafetyGuaranteed, setWomenSafetyGuaranteed] = useState(true);
  const [safetyLeadName, setSafetyLeadName] = useState(currentUser.name);
  const [safetyLeadContact, setSafetyLeadContact] = useState(currentUser.phone || '+91 98201 44521');
  const [buddySystem, setBuddySystem] = useState(true);
  const [transitDetails, setTransitDetails] = useState('300m from Sion Railway Station / Bus Stop');

  // Anti-Profit & Betterment Charter Declarations
  const [certifyZeroProfit, setCertifyZeroProfit] = useState(true);
  const [certifyDirectBetterment, setCertifyDirectBetterment] = useState(true);
  const [certifyFreeAccess, setCertifyFreeAccess] = useState(true);

  // Error validation
  const [formError, setFormError] = useState<string | null>(null);

  // Real-Time Betterment & Non-Profit Inspection Engine
  const inspection = useMemo(() => {
    return inspectSocialWorkInitiative(
      title,
      customCategoryName || category,
      description,
      beneficiaryGroup,
      publicBenefitStatement
    );
  }, [title, customCategoryName, category, description, beneficiaryGroup, publicBenefitStatement]);

  // Daylight validation check
  const isTimeDaylight = (start: string, end: string) => {
    const parseHour = (t: string) => {
      const [h] = t.split(':').map(Number);
      return h;
    };
    const startH = parseHour(start);
    const endH = parseHour(end);
    // Daylight between 06:30 and 17:45
    return startH >= 6 && endH <= 18 && startH < endH;
  };

  // Handle Preset Cause Selection
  const handlePresetSelect = (preset: (typeof SOCIAL_WORK_CAUSE_PRESETS)[0]) => {
    setCategory(preset.id);
    setCustomCategoryName(preset.name);
    setBeneficiaryGroup(preset.beneficiary);
    // Suggest appropriate sample photo if available
    const matchingPhoto = SAMPLE_BEFORE_PHOTOS.find((p) => p.category === preset.id);
    if (matchingPhoto) {
      setPhotoUrl(matchingPhoto.url);
      setPhotoFileName(matchingPhoto.title);
    }
  };

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setPhotoUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter an initiative title.');
      return;
    }
    if (!customCategoryName.trim()) {
      setFormError('Please provide a name for this social work category.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the initiative and the work to be done.');
      return;
    }
    if (!photoUrl) {
      setFormError('Please upload or select 1 photo of the location needing social action.');
      return;
    }
    if (!isTimeDaylight(startTime, endTime)) {
      setFormError('Safety Requirement: Social work must be scheduled during daylight hours (between 6:30 AM and 6:00 PM).');
      return;
    }
    if (!publicBenefitStatement.trim() || publicBenefitStatement.length < 20) {
      setFormError('Please specify how this initiative directly benefits people and society (min 20 chars).');
      return;
    }

    // Strict Non-Profit & Commercial Monitoring Enforcement
    if (inspection.profitRisk === 'high_risk_flagged') {
      setFormError(
        `Commercial Activity Blocked: Prohibited profit terms detected ("${inspection.flaggedKeywords.join(
          '", "'
        )}"). Social work initiatives on CleanMeet must strictly never generate individual profit, ticket sales, or commercial revenue.`
      );
      return;
    }

    if (!certifyZeroProfit || !certifyDirectBetterment || !certifyFreeAccess) {
      setFormError('You must agree to all 3 covenants of the Non-Profit & Societal Betterment Charter.');
      return;
    }

    const newDrive: SocialDrive = {
      id: `drive-${Date.now()}`,
      title: title.trim(),
      category,
      customCategoryName: customCategoryName.trim(),
      beneficiaryGroup: beneficiaryGroup.trim() || inspection.detectedBeneficiary,
      description: description.trim(),
      beforePhotoUrl: photoUrl,
      organizer: currentUser,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      isDaytime: true,
      targetHours,
      deadlineTime: `Must finish within ${endTime} (Daylight)`,
      bettermentDetails: {
        publicBenefitStatement: publicBenefitStatement.trim(),
        zeroProfitCertified: true,
        bettermentScore: inspection.bettermentScore,
        beneficiaryGroup: beneficiaryGroup.trim() || inspection.detectedBeneficiary,
        monitoringStatus: 'verified_betterment',
        auditNotes: [
          `Charter Signed: Zero Individual Profit Certified by ${currentUser.name}`,
          `Direct Societal Betterment verified: Beneficiary - ${beneficiaryGroup.trim()}`,
          `Audit Index: ${inspection.bettermentScore}% Public Benefit Compliance`,
        ],
        auditTimestamp: new Date().toISOString(),
      },
      location: {
        address,
        landmark,
        city,
        lat,
        lng,
      },
      volunteersNeeded,
      volunteersJoined: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'Organizer & Lead',
          joinedAt: new Date().toISOString(),
          status: 'registered',
        },
      ],
      womenSafety: {
        guaranteed: womenSafetyGuaranteed,
        safetyLeadName,
        safetyLeadContact,
        daylightOnly: true,
        buddySystemEnforced: buddySystem,
        safeRestroomsNearby: true,
        publicTransitDistance: transitDetails,
        emergencyFirstAidKit: true,
        policeStationNearby: 'Local Police Chowki within 800m',
      },
      equipmentProvided: [
        'All necessary work kits provided 100% free',
        'Protective safety gloves & sanitizers',
        'First aid medical emergency kit',
      ],
      whatToBring: ['Personal reusable water bottle', 'Cap / hat for sun'],
      status: 'recruiting',
    };

    onCreateDrive(newDrive);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-950 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-400 text-stone-950 border-2 border-stone-950 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-stone-950">
                Post Social Work Initiative
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-sans">
              Social work is open, diverse, and custom-named by you. Monitored strictly for genuine societal betterment with zero individual profit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{formError}</div>
            </div>
          )}

          {/* Section 1: Choose Cause Archetype & Custom Naming */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>1. Diverse Social Work Cause & Custom Naming</span>
                </label>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose a cause archetype or create your own custom social work type. Name it freely!
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Unlimited Types
              </span>
            </div>

            {/* Diverse Preset Archetypes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {SOCIAL_WORK_CAUSE_PRESETS.map((preset) => {
                const isSelected = category === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-2.5 text-left rounded-xl border text-xs font-semibold transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    <span className="text-[10px] text-stone-400 font-normal mt-1 truncate">
                      {preset.beneficiary}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Poster Custom Category Name */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <span>Name Your Social Work Category / Cause</span>
                  <span className="text-emerald-600 text-[11px] font-normal">(Freely Named by You)</span>
                </label>
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="e.g., Slum Youth Coding Club, Stray Dog Anti-Rabies Camp..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium mt-1 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">
                  Direct Public Beneficiary Group
                </label>
                <input
                  type="text"
                  value={beneficiaryGroup}
                  onChange={(e) => setBeneficiaryGroup(e.target.value)}
                  placeholder="e.g., Underprivileged Children, Street Animals, Senior Citizens..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium mt-1 bg-white"
                  required
                />
              </div>
            </div>

            {/* Public Betterment Statement */}
            <div>
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Public Betterment Statement</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  How does this directly improve lives and society?
                </span>
              </label>
              <textarea
                rows={2}
                value={publicBenefitStatement}
                onChange={(e) => setPublicBenefitStatement(e.target.value)}
                placeholder="Explain the specific societal betterment, humanitarian, civic, or environmental outcome..."
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium mt-1 bg-white"
                required
              />
            </div>

            {/* Real-time Societal Betterment & Non-Profit Monitor */}
            <div className="p-3.5 rounded-xl border bg-white space-y-2.5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-800">
                    Active Betterment & Non-Profit Pre-Flight Monitor
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      inspection.bettermentScore >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : inspection.bettermentScore >= 65
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Betterment Index: {inspection.bettermentScore}%
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      inspection.profitRisk === 'zero'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    }`}
                  >
                    {inspection.profitRisk === 'zero' ? '100% Non-Profit' : 'Commercial Flag'}
                  </span>
                </div>
              </div>

              {/* Red flag notice if commercial profit is detected */}
              {inspection.profitRisk === 'high_risk_flagged' && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Prohibited Commercial / Profit Intent Detected</div>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Terms like <strong>"{inspection.flaggedKeywords.join('", "')}"</strong> suggest commercial monetization or admission fees. CleanMeet strictly prohibits personal or commercial profit. Please remove any paid pricing or sales messaging.
                    </p>
                  </div>
                </div>
              )}

              {/* Positive assurance */}
              {inspection.profitRisk === 'zero' && (
                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified Public Good: Free from commercial monetization, ticket fees, or private brand selling.</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Initiative Title & Description */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Initiative Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dharavi Slum Community Library & Digital Literacy Drive"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Description of Social Work Needed
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the current condition, the beneficiaries, what volunteers will do together, and the social impact..."
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Section 3: Mandatory 1 Photo of Site Needing Social Action */}
          <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>1 Photo of the Place or Need (Mandatory)</span>
                </label>
                <p className="text-xs text-stone-500 mt-0.5">
                  Others join only after seeing the verified social work need.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                1 Photo Required
              </span>
            </div>

            {/* Photo Preview */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-stone-300 bg-stone-200">
              <img
                src={photoUrl}
                alt="Selected place"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs flex items-center justify-between">
                <span className="truncate max-w-xs">{photoFileName || 'Selected verification photo'}</span>
                <span className="text-[10px] text-emerald-300 font-semibold">1 Photo Attached</span>
              </div>
            </div>

            {/* Upload or Select from Presets */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <label className="w-full sm:w-auto cursor-pointer px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-emerald-500 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1 overflow-x-auto flex items-center gap-2 w-full py-1">
                <span className="text-[10px] text-stone-500 whitespace-nowrap">Or select verified sample:</span>
                {SAMPLE_BEFORE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(sample.url);
                      setPhotoFileName(sample.title);
                    }}
                    className={`shrink-0 w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      photoUrl === sample.url
                        ? 'border-emerald-600 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={sample.title}
                  >
                    <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Clickable Google Map & Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Clickable & Trackable Google Map Location</span>
                </label>
                <p className="text-xs text-stone-500">
                  Volunteers will track the route to this spot just like in Zomato map.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600">Street / Area Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-600">Prominent Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 mt-1"
                />
              </div>
            </div>

            {/* Clickable Map Component */}
            <GoogleMapView
              destination={{ lat, lng, title: title || 'New Social Work Site', address }}
              height="220px"
              interactiveSelect={true}
              showRoute={false}
              onLocationSelect={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
            />
          </div>

          {/* Section 5: Volunteers Needed & Daytime Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Volunteers Needed */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>How Many Volunteers Needed?</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="w-12 text-center text-base font-black text-emerald-700 bg-white px-2 py-1 rounded-lg border border-stone-200">
                  {volunteersNeeded}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Recommended team size for {customCategoryName}: 4-12 people.
              </p>
            </div>

            {/* Daytime Schedule & Hours */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Daytime Schedule & Duration</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold">Start Time</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold">End Time</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                  />
                </div>
              </div>
              <div className="text-[11px] text-amber-900 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Estimated: ~{targetHours} hours within daylight</span>
              </div>
            </div>
          </div>

          {/* Section 6: Women Safety Guaranteed Checklist */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Women Safety Protocol & Guarantee</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={womenSafetyGuaranteed}
                  onChange={(e) => setWomenSafetyGuaranteed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {womenSafetyGuaranteed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-900">Assigned Safety Lead</span>
                  <input
                    type="text"
                    value={safetyLeadName}
                    onChange={(e) => setSafetyLeadName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white mt-1"
                    placeholder="Name of Safety Coordinator"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-900">Safety Lead Phone</span>
                  <input
                    type="text"
                    value={safetyLeadContact}
                    onChange={(e) => setSafetyLeadContact(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white mt-1"
                    placeholder="Emergency Contact"
                  />
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-semibold text-emerald-900">Nearest Public Transit Access</span>
                  <input
                    type="text"
                    value={transitDetails}
                    onChange={(e) => setTransitDetails(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white mt-1"
                    placeholder="e.g. 250m from Metro Gate 1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Mandatory Non-Profit & Societal Betterment Charter Declaration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Non-Profit & Societal Betterment Charter Declaration
                </h4>
                <p className="text-[11px] text-stone-400">
                  By posting, you legally and ethically covenant that this drive serves public good without financial profit.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certifyZeroProfit}
                  onChange={(e) => setCertifyZeroProfit(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span className="text-stone-300">
                  <strong className="text-white">Strictly Zero Individual or Commercial Profit:</strong> I affirm that this drive is 100% free with NO admission charges, ticket sales, commercial promotion, marketing leads, or financial gain for myself, any organizer, or third-party company.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certifyDirectBetterment}
                  onChange={(e) => setCertifyDirectBetterment(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span className="text-stone-300">
                  <strong className="text-white">Direct Societal Betterment:</strong> I certify that all activities directly serve the welfare of people, children, vulnerable communities, stray animals, or public commons and civic infrastructure.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certifyFreeAccess}
                  onChange={(e) => setCertifyFreeAccess(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span className="text-stone-300">
                  <strong className="text-white">Free & Transparent Community Access:</strong> All equipment, safety kits, educational materials, or meals provided are distributed freely to participants and beneficiaries without hidden costs.
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t-2 border-stone-200 flex items-center justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border-2 border-stone-300 text-stone-800 text-xs font-bold font-display hover:border-stone-950 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={inspection.profitRisk === 'high_risk_flagged'}
              className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black font-display flex items-center gap-2 border-2 border-stone-950 transition-all ${
                inspection.profitRisk === 'high_risk_flagged'
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-75'
                  : 'bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white shadow-[2px_2px_0px_#10b981] active:translate-y-0.5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Publish Verified Social Work Drive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
