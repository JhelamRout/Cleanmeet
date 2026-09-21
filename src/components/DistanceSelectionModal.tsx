import React, { useState } from 'react';
import { UserProfile, SocialDrive } from '../types';
import { MAX_SEARCH_RADIUS_KM, RADIUS_PRESETS, calculateDistanceKm } from '../utils/geo';
import { MapPin, Sliders, CheckCircle, Navigation, ShieldCheck, HeartHandshake, Compass, Sparkles } from 'lucide-react';

interface DistanceSelectionModalProps {
  currentUser: UserProfile;
  allDrives: SocialDrive[];
  onSaveRadius: (newRadiusKm: number) => void;
  onClose?: () => void;
  isInitialSignIn?: boolean;
}

export const DistanceSelectionModal: React.FC<DistanceSelectionModalProps> = ({
  currentUser,
  allDrives,
  onSaveRadius,
  onClose,
  isInitialSignIn = false,
}) => {
  const initialRadius = Math.min(
    MAX_SEARCH_RADIUS_KM,
    currentUser.searchRadiusKm && currentUser.searchRadiusKm > 0
      ? currentUser.searchRadiusKm
      : 20
  );

  const [radius, setRadius] = useState<number>(initialRadius);

  const userCoords = currentUser.locationCoords || {
    lat: 19.0596,
    lng: 72.8295,
    label: `${currentUser.city || 'Local Area'} Base`,
  };

  // Calculate drives within this selected radius
  const drivesWithDistance = allDrives.map((d) => {
    const dist = calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      d.location.lat,
      d.location.lng
    );
    return { drive: d, distance: dist };
  });

  const matchingDrives = drivesWithDistance.filter((item) => item.distance <= radius);

  const handleConfirm = () => {
    onSaveRadius(radius);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 uppercase tracking-wider">
                {isInitialSignIn ? 'Step 1 of 1 • Sign In Preference' : 'Search Zone Setting'}
              </span>
              <h2 className="text-xl font-black tracking-tight leading-tight mt-0.5">
                Choose Your Search Radius
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Set the distance you want to search for social work (Highest 50 km)
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-black/15 p-2.5 rounded-xl text-xs text-emerald-50">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="truncate">
              Your Location: <strong>{userCoords.label || currentUser.city}</strong>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Distance Display Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center relative">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Active Community Search Radius
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
                {radius}
              </span>
              <span className="text-lg font-bold text-stone-500">km</span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {matchingDrives.length}{' '}
                {matchingDrives.length === 1 ? 'initiative' : 'initiatives'} found within {radius} km
              </span>
            </div>

            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Max 50 km
              </span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
              <span>1 km (Hyperlocal)</span>
              <span className="text-emerald-700 font-bold">{radius} km</span>
              <span>50 km (Regional Cap)</span>
            </div>

            <input
              type="range"
              min={1}
              max={MAX_SEARCH_RADIUS_KM}
              step={1}
              value={radius}
              onChange={(e) => setRadius(Math.min(MAX_SEARCH_RADIUS_KM, parseInt(e.target.value, 10)))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[10px] text-stone-400 font-medium px-1">
              <span>Walking</span>
              <span>Neighborhood</span>
              <span>City</span>
              <span>Max (50 km)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Quick Selection Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.km}
                  type="button"
                  onClick={() => setRadius(preset.km)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    radius === preset.km
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold">{preset.label}</span>
                    {radius === preset.km && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                    {preset.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preview of Nearby Drives */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">
                Preview of Nearby Initiatives ({matchingDrives.length})
              </span>
              <span className="text-stone-500 text-[11px]">Ranked by proximity</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {matchingDrives.slice(0, 3).map(({ drive, distance }) => (
                <div
                  key={drive.id}
                  className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2"
                >
                  <div className="truncate flex-1">
                    <div className="font-semibold text-stone-900 truncate">
                      {drive.title}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{drive.location.landmark || drive.location.address}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {distance} km away
                  </span>
                </div>
              ))}
              {matchingDrives.length > 3 && (
                <div className="text-center text-[11px] text-stone-500 pt-0.5">
                  + {matchingDrives.length - 3} more drives within your {radius} km perimeter
                </div>
              )}
              {matchingDrives.length === 0 && (
                <div className="p-3 text-center text-stone-400 text-xs">
                  No active drives within {radius} km yet. Expand to 15–50 km to find community initiatives!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {onClose && !isInitialSignIn ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
          ) : (
            <span className="text-[11px] text-stone-500 font-medium">
              You can adjust this anytime in your profile
            </span>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 ml-auto"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Start Engaging ({radius} km)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
