import React, { useState } from 'react';
import { UserProfile, AwardedBadge, SocialDrive } from '../types';
import { MAX_SEARCH_RADIUS_KM, RADIUS_PRESETS, calculateDistanceKm } from '../utils/geo';
import {
  X,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  Share2,
  Compass,
  MapPin,
  Sliders,
  ArrowRight,
  Sparkles,
  Navigation,
} from 'lucide-react';

interface UserProfileModalProps {
  currentUser: UserProfile;
  completedDrives: SocialDrive[];
  allDrives?: SocialDrive[];
  onClose: () => void;
  onOpenBadge: (drive: SocialDrive, badge?: AwardedBadge) => void;
  onUpdateRadius?: (newRadiusKm: number) => void;
  onSelectDrive?: (drive: SocialDrive) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  completedDrives,
  allDrives = [],
  onClose,
  onOpenBadge,
  onUpdateRadius,
  onSelectDrive,
}) => {
  const [currentRadius, setCurrentRadius] = useState<number>(
    Math.min(MAX_SEARCH_RADIUS_KM, currentUser.searchRadiusKm || 20)
  );

  const userCoords = currentUser.locationCoords || {
    lat: 19.0596,
    lng: 72.8295,
    label: `${currentUser.city} Volunteer Base`,
  };

  const handleRadiusChange = (newVal: number) => {
    const clamped = Math.min(MAX_SEARCH_RADIUS_KM, Math.max(1, newVal));
    setCurrentRadius(clamped);
    if (onUpdateRadius) {
      onUpdateRadius(clamped);
    }
  };

  // Calculate drives within the user's search radius for engagement
  const drivesWithDist = allDrives.map((d) => {
    const dist = calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      d.location.lat,
      d.location.lng
    );
    return { drive: d, distance: dist };
  });

  const drivesWithinRadius = drivesWithDist
    .filter((item) => item.distance <= currentRadius)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <span>{currentUser.name}</span>
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <UserCheck className="w-3 h-3" />
                  Verified Volunteer
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  <Compass className="w-3 h-3" />
                  {currentRadius} km Search Radius
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentUser.roleTitle} • {userCoords.label || currentUser.city}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Search Radius & Engagement Preference (Prompt Requirement) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-stone-50 border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                    Community Search & Engagement Radius
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Within 50 km highest
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Adjust the radius you want to search. Initiatives within this zone appear in your profile for you to engage.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 leading-none block">
                  {currentRadius} <span className="text-xs font-semibold text-emerald-600">km</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Search Distance</span>
              </div>
            </div>

            {/* Slider with 50 km maximum cap */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
                <span>1 km</span>
                <span className="text-emerald-700 font-bold">{currentRadius} km selected</span>
                <span>50 km max</span>
              </div>
              <input
                type="range"
                min={1}
                max={MAX_SEARCH_RADIUS_KM}
                value={currentRadius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.km}
                  type="button"
                  onClick={() => handleRadiusChange(preset.km)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentRadius === preset.km
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {preset.label} ({preset.desc.split(' ')[0]})
                </button>
              ))}
            </div>

            {/* Initiatives in Profile to Engage */}
            <div className="pt-3 border-t border-emerald-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Initiatives In Your {currentRadius} km Radius to Engage ({drivesWithinRadius.length})
                  </span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  From {userCoords.label || currentUser.city}
                </span>
              </div>

              {drivesWithinRadius.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/80 border border-stone-200 text-center text-xs text-stone-500">
                  No social work drives found within {currentRadius} km. Expand your radius up to 50 km to discover opportunities nearby.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {drivesWithinRadius.map(({ drive, distance }) => {
                    const isJoined = drive.volunteersJoined.some((v) => v.userId === currentUser.id);
                    return (
                      <div
                        key={drive.id}
                        className="p-3 rounded-xl bg-white border border-stone-200/90 hover:border-emerald-300 shadow-xs flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 text-[10px] mb-1">
                            <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              📍 {distance} km away
                            </span>
                            <span className="text-stone-500 font-medium">
                              {drive.status === 'in_progress' ? '⚡ In Progress' : 'Open for Volunteers'}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-stone-900 line-clamp-1">
                            {drive.title}
                          </h5>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {drive.location.landmark || drive.location.address}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[10px] text-stone-500">
                            {drive.volunteersJoined.length}/{drive.volunteersNeeded} Volunteers
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectDrive) {
                                onClose();
                                onSelectDrive(drive);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>{isJoined ? 'View Status' : 'Engage'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Achievement Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                Total Hours
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">
                {currentUser.totalHours.toFixed(1)}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Verified Service</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 block">
                Drives Finished
              </span>
              <span className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 block">
                {currentUser.drivesCompleted}
              </span>
              <span className="text-[11px] text-blue-700 font-medium">Cleanups & Planting</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block">
                Badges Earned
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 block">
                {currentUser.badges.length}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">LinkedIn Ready</span>
            </div>

            <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-800 block">
                Drives Organized
              </span>
              <span className="text-2xl sm:text-3xl font-black text-violet-900 mt-1 block">
                {currentUser.drivesOrganized}
              </span>
              <span className="text-[11px] text-violet-700 font-medium">Community Lead</span>
            </div>
          </div>

          {/* Badges and LinkedIn Credentials Collection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Earned Community Service Badges ({currentUser.badges.length})</span>
              </h3>
              <span className="text-xs text-stone-500">Includes official verifiable credentials</span>
            </div>

            {currentUser.badges.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-stone-300 text-center text-stone-500 text-xs">
                <Award className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                <p className="font-semibold text-stone-700">No badges earned yet</p>
                <p className="mt-1">
                  Volunteer for an active plastic cleanup or tree plantation to earn your first verifiable badge!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentUser.badges.map((badge) => {
                  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                    badge.badgeTitle
                  )}&organizationName=${encodeURIComponent(
                    'CleanMeet Community Action'
                  )}&issueYear=2026&issueMonth=9&certId=${encodeURIComponent(
                    badge.credentialId
                  )}`;

                  return (
                    <div
                      key={badge.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900 leading-tight">
                              {badge.badgeTitle}
                            </h4>
                            <span className="text-[10px] text-stone-500">
                              {badge.hoursContributed} hrs • {badge.dateAwarded}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-[10px] font-bold text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {badge.credentialId}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 font-medium">
                        "{badge.driveTitle}"
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {badge.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                        <a
                          href={linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          <span>Add to LinkedIn</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            const drive = completedDrives.find((d) => d.id === badge.driveId) || completedDrives[0];
                            if (drive) onOpenBadge(drive, badge);
                          }}
                          className="py-1.5 px-3 rounded-lg border border-stone-300 text-stone-700 text-[11px] font-semibold hover:bg-stone-100"
                        >
                          Certificate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Environmental Impact Breakdown */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Collective Remediation Impact
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-lg font-black text-amber-700 block">74 kg</span>
                <span className="text-stone-500 text-[11px]">Plastic Extracted</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-lg font-black text-emerald-700 block">38</span>
                <span className="text-stone-500 text-[11px]">Native Trees Planted</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-lg font-black text-blue-700 block">1,120 m²</span>
                <span className="text-stone-500 text-[11px]">Public Land Restored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            CleanMeet Community ID: {currentUser.id} • Search Radius: {currentRadius} km (Max 50 km)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
