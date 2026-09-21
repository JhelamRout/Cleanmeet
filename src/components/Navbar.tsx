import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, PlusCircle, Award, Users, ShieldCheck, HeartHandshake, MapPin, Compass, Sliders, Youtube } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onOpenCreate: () => void;
  onOpenProfile: () => void;
  onOpenDistanceModal: () => void;
  onOpenYouTubeKit?: () => void;
  totalNetworkHours: number;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  filterByRadiusOnly?: boolean;
  onToggleFilterByRadius?: () => void;
  matchingRadiusCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenCreate,
  onOpenProfile,
  onOpenDistanceModal,
  onOpenYouTubeKit,
  totalNetworkHours,
  activeFilter,
  onSelectFilter,
  filterByRadiusOnly = false,
  onToggleFilterByRadius,
  matchingRadiusCount = 0,
}) => {
  const userRadius = currentUser.searchRadiusKm || 20;

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f5]/90 backdrop-blur-xl border-b border-stone-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-stone-950 text-emerald-400 flex items-center justify-center border-2 border-stone-950 shadow-[2px_2px_0px_#10b981]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-stone-950 tracking-tight font-display">
                  CleanMeet<span className="text-emerald-500">.</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300/80 sticker-badge">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  Real Impact • Daylight
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block font-sans">
                Hyperlocal Social Action & Mutual Aid
              </p>
            </div>
          </div>

          {/* Center Search Radius Button & Stats */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Search Radius Trigger */}
            <button
              type="button"
              onClick={onOpenDistanceModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-stone-900/15 text-xs text-stone-900 font-semibold transition-all hover:border-emerald-500 shadow-xs"
              title="Click to adjust your community search radius (up to 50 km)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Radar: <strong className="font-mono-code text-stone-950">{userRadius} km</strong>
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md font-mono-code font-bold">
                Max 50km
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-xs font-semibold text-stone-700 font-mono-code">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{totalNetworkHours.toFixed(1)} hrs IRL</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* YouTube Marketing Launch Kit CTA */}
            {onOpenYouTubeKit && (
              <button
                type="button"
                onClick={onOpenYouTubeKit}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-red-50 text-stone-900 hover:text-red-700 text-xs font-black font-display border-2 border-stone-950 shadow-[2px_2px_0px_#ef4444] active:translate-y-0.5 transition-all"
                title="Open YouTube Marketing & Creator Launch Kit"
              >
                <div className="w-4 h-4 rounded bg-[#ff0000] text-white flex items-center justify-center shrink-0">
                  <Youtube className="w-2.5 h-2.5 fill-current" />
                </div>
                <span>YouTube Kit</span>
              </button>
            )}

            {/* Mobile Search Radius Trigger */}
            <button
              type="button"
              onClick={onOpenDistanceModal}
              className="md:hidden p-2 rounded-xl bg-white border border-stone-900/15 text-stone-900 text-xs font-bold flex items-center gap-1 shadow-xs"
              title="Search radius"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono-code">{userRadius}k</span>
            </button>

            {/* Create Drive CTA */}
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-stone-950 hover:bg-emerald-500 hover:text-stone-950 text-white text-xs sm:text-sm font-extrabold font-display transition-all tactile-btn border border-stone-950"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Work</span>
            </button>

            {/* Profile & Badges CTA */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white border border-stone-900/10 hover:border-emerald-400 hover:shadow-xs text-stone-800 transition-all"
              title="View my community badges, search perimeter and initiatives to engage"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-emerald-500/40"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-extrabold text-stone-950 leading-tight truncate max-w-[110px] font-display">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold font-mono-code flex items-center gap-0.5">
                  <Award className="w-3 h-3" />
                  <span>{currentUser.badges.length} Badges</span>
                </div>
              </div>
            </button>

            {/* Switch Demo User Dropdown */}
            <div className="relative group hidden sm:block">
              <select
                aria-label="Switch active volunteer persona"
                value={currentUser.id}
                onChange={(e) => {
                  const u = allUsers.find((user) => user.id === e.target.value);
                  if (u) onSwitchUser(u);
                }}
                className="text-xs bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl py-2 px-2.5 pr-6 font-semibold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans shadow-xs"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    👤 {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar & Distance Toggle */}
        <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center justify-between gap-3 border-t border-stone-200/60 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            {/* Radius Filter Pill Toggle */}
            {onToggleFilterByRadius && (
              <button
                type="button"
                onClick={onToggleFilterByRadius}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono-code whitespace-nowrap transition-all flex items-center gap-1.5 border text-xs ${
                  filterByRadiusOnly
                    ? 'bg-stone-950 text-emerald-300 border-stone-950 shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300/70'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nearby ≤ {userRadius}km ({matchingRadiusCount})</span>
              </button>
            )}

            {[
              { id: 'all', label: '⚡ All Causes' },
              { id: 'education_literacy', label: '📚 Education' },
              { id: 'hunger_relief', label: '🍲 Food Aid' },
              { id: 'animal_welfare', label: '🐾 Stray Pets' },
              { id: 'elderly_care', label: '👵 Elderly' },
              { id: 'plastic_cleanup', label: '🗑️ Cleanups' },
              { id: 'tree_planting', label: '🌱 Afforestation' },
              { id: 'waterbody_restore', label: '💧 Water' },
              { id: 'women_safety', label: '🛡️ Safe Squad' },
              { id: 'in_progress', label: '🔥 Active Now' },
              { id: 'completed', label: '✨ Completed' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                  activeFilter === f.id
                    ? 'bg-stone-950 text-white shadow-xs border border-stone-950'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenDistanceModal}
            className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 font-semibold shrink-0 ml-auto"
          >
            <Sliders className="w-3 h-3 text-emerald-600" />
            <span>Radar Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
