import React, { useState } from 'react';
import { UserProfile, SocialDrive } from '../types';
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Camera,
  Users,
  Award,
  Sun,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  Compass,
  Upload,
  User,
  Mail,
  Phone,
  Check,
  Sliders,
  Play
} from 'lucide-react';
import { MAX_SEARCH_RADIUS_KM } from '../utils/geo';

interface OnboardingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: (user: UserProfile) => void;
  onChoosePostDrive: () => void;
  onChooseVolunteer: () => void;
  existingUser?: UserProfile;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
];

export const OnboardingFlowModal: React.FC<OnboardingFlowModalProps> = ({
  isOpen,
  onClose,
  onCompleteProfile,
  onChoosePostDrive,
  onChooseVolunteer,
  existingUser,
}) => {
  // Steps: 1 = App Intent & Function, 2 = Sign Up & Build Profile, 3 = Choose: Post vs Volunteer
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Profile Form state
  const [name, setName] = useState(existingUser?.name || '');
  const [email, setEmail] = useState(existingUser?.email || '');
  const [phone, setPhone] = useState(existingUser?.phone || '');
  const [city, setCity] = useState(existingUser?.city || 'Mumbai, Maharashtra');
  const [roleTitle, setRoleTitle] = useState(existingUser?.roleTitle || 'Community Volunteer');
  const [bio, setBio] = useState('Passionate about clean streets, climate action, and community welfare.');
  const [selectedAvatar, setSelectedAvatar] = useState(
    existingUser?.avatar || AVATAR_OPTIONS[0]
  );
  const [radiusKm, setRadiusKm] = useState<number>(existingUser?.searchRadiusKm || 20);

  if (!isOpen) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser: UserProfile = {
      id: existingUser?.id || `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@cleanmeet.org`,
      phone: phone.trim(),
      city: city.trim() || 'Local Area',
      roleTitle: roleTitle.trim() || 'Community Volunteer',
      avatar: selectedAvatar,
      totalHours: existingUser?.totalHours || 0,
      drivesCompleted: existingUser?.drivesCompleted || 0,
      drivesOrganized: existingUser?.drivesOrganized || 0,
      badges: existingUser?.badges || [],
      searchRadiusKm: radiusKm,
      hasConfiguredRadius: true,
      locationCoords: existingUser?.locationCoords || {
        lat: 19.0596,
        lng: 72.8295,
        label: city.trim() || 'My Community Base',
      },
    };

    onCompleteProfile(newUser);
    setStep(3); // Proceed to choice screen
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-[8px_8px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress Stepper Bar */}
        <div className="p-4 sm:px-6 bg-stone-950 text-white border-b-2 border-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-400 text-stone-950 font-black font-mono-code flex items-center justify-center text-sm border border-emerald-300">
              {step}/3
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono-code">
                {step === 1 && 'Step 1 • Intent & Purpose'}
                {step === 2 && 'Step 2 • User Sign Up & Profile'}
                {step === 3 && 'Step 3 • Start Social Work'}
              </span>
              <h2 className="text-sm sm:text-base font-black font-display text-white">
                {step === 1 && 'Welcome to CleanMeet'}
                {step === 2 && 'Build Your Volunteer Profile'}
                {step === 3 && 'Choose Your Starting Action'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono-code text-[11px]">
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-emerald-400' : 'bg-stone-700'}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-emerald-400' : 'bg-stone-700'}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-emerald-400' : 'bg-stone-700'}`} />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#faf9f5]">

          {/* STEP 1: APP INTENT & HOW IT FUNCTIONS */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Mission Statement Hero */}
              <div className="p-5 rounded-2xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-400 text-stone-950 border-2 border-stone-950 text-xs font-black font-mono-code uppercase sticker-badge">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Non-Profit • Zero Commercial Gain</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-display text-stone-950 tracking-tight">
                  A Social Platform Built Exclusively for Societal Betterment
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-lg mx-auto leading-relaxed">
                  CleanMeet connects local citizens to solve neglected community problems in the real world. No corporate greenwashing, no monetization—just transparent collective action.
                </p>
              </div>

              {/* The 4 Core Functions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-950 transition-all space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black font-display text-stone-950">
                    1. Spot & Post 1 Photo
                  </h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Walk past an uncleaned canal, garbage pile, or unkept public ground? Take 1 photo and post the need. The community takes it from there.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-950 transition-all space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black font-display text-stone-950">
                    2. Hyperlocal Squad Radar
                  </h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Volunteers choose their radius (up to 50 km). When someone posts a drive nearby, nearby volunteers assemble with Google Maps tracking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-950 transition-all space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black font-display text-stone-950">
                    3. Daylight & Women Safety
                  </h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    All initiatives are strictly held during bright daylight hours with verified buddy systems and designated safety leads.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-950 transition-all space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black font-display text-stone-950">
                    4. Verifiable LinkedIn Badges
                  </h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Once work is finished with proof, all participants earn authenticated digital community service certificates to add to their resumes.
                  </p>
                </div>
              </div>

              {/* Bottom CTA to Step 2 */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white font-black font-display text-sm border-2 border-stone-950 shadow-[3px_3px_0px_#10b981] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
                >
                  <span>Sign Up & Build Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: USER SIGN UP & PROFILE BUILDING */}
          {step === 2 && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in duration-150">
              {/* Avatar Selection */}
              <div className="p-4 rounded-2xl bg-white border-2 border-stone-950 shadow-[3px_3px_0px_#000] space-y-2.5">
                <label className="text-xs font-black font-display text-stone-950 uppercase tracking-wider block">
                  Select Your Profile Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(img)}
                      className={`relative shrink-0 w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === img
                          ? 'border-emerald-500 ring-2 ring-emerald-400 scale-105 shadow-xs'
                          : 'border-stone-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Avatar option" className="w-full h-full object-cover" />
                      {selectedAvatar === img && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border-2 border-stone-300 focus:border-stone-950 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email Address (For Badges)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="aarav@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border-2 border-stone-300 focus:border-stone-950 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phone (Safety Contact)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border-2 border-stone-300 focus:border-stone-950 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>City / Neighborhood</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bandra West, Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border-2 border-stone-300 focus:border-stone-950 bg-white"
                  />
                </div>
              </div>

              {/* Role & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900">
                    Primary Volunteer Role
                  </label>
                  <select
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full text-xs font-bold font-mono-code p-2.5 rounded-xl border-2 border-stone-300 bg-white"
                  >
                    <option value="Community Volunteer">General Community Volunteer</option>
                    <option value="Youth Squad Leader">Youth Squad Leader</option>
                    <option value="Waste Remediation Specialist">Waste Remediation Specialist</option>
                    <option value="Safety & Buddy Lead">Safety & Buddy Coordinator</option>
                    <option value="College Student Advocate">College Student Advocate</option>
                    <option value="Eco Restoration Volunteer">Eco Restoration Volunteer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black font-display text-stone-900">
                    Search Radius (Max 50 km)
                  </label>
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-stone-100 border border-stone-300">
                    <input
                      type="range"
                      min="2"
                      max={MAX_SEARCH_RADIUS_KM}
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="flex-1 accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-black font-mono-code px-2 py-0.5 rounded bg-stone-950 text-emerald-400 min-w-14 text-center">
                      {radiusKm} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl border-2 border-stone-300 text-stone-700 text-xs font-bold font-display hover:border-stone-950"
                >
                  ← Back to Purpose
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white font-black font-display text-xs sm:text-sm border-2 border-stone-950 shadow-[3px_3px_0px_#10b981] flex items-center gap-2 active:translate-y-0.5 transition-all"
                >
                  <span>Save Profile & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ACTION DECISION (POST SOCIAL WORK OR VOLUNTEER) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150 text-center py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-black font-mono-code sticker-badge">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Profile Verified & Ready!</span>
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black font-display text-stone-950">
                  Welcome to the Squad, {name.split(' ')[0]}!
                </h3>
                <p className="text-xs text-stone-600 font-sans">
                  What would you like to do right now? You can initiate a new cause or join an existing effort.
                </p>
              </div>

              {/* The Two Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto pt-2">
                
                {/* CHOICE 1: POST A SOCIAL WORK NEED */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChoosePostDrive();
                  }}
                  className="p-5 rounded-3xl bg-white border-2 border-stone-950 hover:border-emerald-600 shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#10b981] hover:-translate-y-0.5 active:translate-y-0.5 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="text-[10px] font-black font-mono-code text-amber-900 uppercase">
                        Option A
                      </div>
                      <h4 className="text-base font-black font-display text-stone-950 group-hover:text-emerald-700 transition-colors">
                        Post a Social Work Need
                      </h4>
                    </div>

                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      Snap 1 photo of an area that needs cleanup or restoration. Set daytime hours and notify nearby volunteers automatically.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-black font-display text-stone-900 group-hover:text-emerald-700">
                    <span>Post 1 Photo Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CHOICE 2: VOLUNTEER IN AN EXISTING DRIVE */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChooseVolunteer();
                  }}
                  className="p-5 rounded-3xl bg-white border-2 border-stone-950 hover:border-emerald-600 shadow-[4px_4px_0px_#10b981] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="text-[10px] font-black font-mono-code text-emerald-900 uppercase">
                        Option B
                      </div>
                      <h4 className="text-base font-black font-display text-stone-950 group-hover:text-emerald-700 transition-colors">
                        Volunteer in 1 Drive
                      </h4>
                    </div>

                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      Browse active initiatives within {radiusKm} km of your location. Join the live squad chat, track coordinates, and help out.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-black font-display text-stone-900 group-hover:text-emerald-700">
                    <span>Explore Nearby Drives</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t-2 border-stone-950 bg-white flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono-code text-[11px]">
            CleanMeet Community Action Network
          </span>
          {step < 3 && (
            <button
              type="button"
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 font-bold font-display"
            >
              Skip to Browse
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
