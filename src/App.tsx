import React, { useState, useEffect } from 'react';
import { SocialDrive, UserProfile, AwardedBadge } from './types';
import { DEMO_USERS, INITIAL_DRIVES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DriveCard } from './components/DriveCard';
import { DriveDetailModal } from './components/DriveDetailModal';
import { CreateDriveModal } from './components/CreateDriveModal';
import { CompletionModal } from './components/CompletionModal';
import { BadgeCertificateModal } from './components/BadgeCertificateModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DistanceSelectionModal } from './components/DistanceSelectionModal';
import { GroupChatModal } from './components/GroupChatModal';
import { InternalChatVaultModal } from './components/InternalChatVaultModal';
import { YouTubeMarketingModal } from './components/YouTubeMarketingModal';
import {
  initializeGroupChatForNewDrive,
  archiveAndRemoveGroupChat,
} from './utils/chatManager';
import { calculateDistanceKm, MAX_SEARCH_RADIUS_KM } from './utils/geo';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  Award,
  Search,
  Users,
  Sun,
  Camera,
  HeartHandshake,
  CheckCircle,
  Clock,
  Trees,
  Trash2,
  Compass,
  Sliders,
  BadgeCheck,
  MessageSquare,
  Database,
  Lock,
  Youtube,
  Video,
} from 'lucide-react';

export default function App() {
  // Load state from localStorage or mock data
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cleanmeet_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(users[0]);

  const [drives, setDrives] = useState<SocialDrive[]>(() => {
    const saved = localStorage.getItem('cleanmeet_drives');
    return saved ? JSON.parse(saved) : INITIAL_DRIVES;
  });

  // Modals state
  const [selectedDrive, setSelectedDrive] = useState<SocialDrive | null>(null);
  const [activeChatDrive, setActiveChatDrive] = useState<SocialDrive | null>(null);
  const [isInternalVaultOpen, setIsInternalVaultOpen] = useState<boolean>(false);
  const [isCreatingDrive, setIsCreatingDrive] = useState<boolean>(false);
  const [isViewingProfile, setIsViewingProfile] = useState<boolean>(false);
  const [completingDrive, setCompletingDrive] = useState<SocialDrive | null>(null);
  const [badgeModalDrive, setBadgeModalDrive] = useState<SocialDrive | null>(null);
  const [activeBadge, setActiveBadge] = useState<AwardedBadge | undefined>(undefined);
  const [isYouTubeKitOpen, setIsYouTubeKitOpen] = useState<boolean>(false);
  const [isSelectingDistance, setIsSelectingDistance] = useState<boolean>(() => {
    return !users[0]?.hasConfiguredRadius;
  });

  // Filters and Search
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterByRadiusOnly, setFilterByRadiusOnly] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cleanmeet_drives', JSON.stringify(drives));
  }, [drives]);

  useEffect(() => {
    localStorage.setItem('cleanmeet_users', JSON.stringify(users));
  }, [users]);

  // Keep currentUser synced
  useEffect(() => {
    const refreshed = users.find((u) => u.id === currentUser.id);
    if (refreshed) setCurrentUser(refreshed);
  }, [users, currentUser.id]);

  // Handler: Save distance search radius preference (Max 50 km)
  const handleSaveRadius = (newRadiusKm: number) => {
    const clamped = Math.min(MAX_SEARCH_RADIUS_KM, Math.max(1, newRadiusKm));
    const updatedUser = {
      ...currentUser,
      searchRadiusKm: clamped,
      hasConfiguredRadius: true,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    setIsSelectingDistance(false);
  };

  // Handler: Switch active volunteer persona & choose search distance
  const handleSwitchUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    if (!newUser.hasConfiguredRadius) {
      setIsSelectingDistance(true);
    }
  };

  // Handler: Create new Social Work initiative
  const handleCreateDrive = (newDrive: SocialDrive) => {
    setDrives((prev) => [newDrive, ...prev]);
    // update user stats
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, drivesOrganized: u.drivesOrganized + 1 }
          : u
      )
    );
    setIsCreatingDrive(false);
    setSelectedDrive(newDrive);

    // Dedicated group chat system opens as soon as social work post is created
    initializeGroupChatForNewDrive(newDrive, currentUser);
    setActiveChatDrive(newDrive);
  };

  // Handler: Join a Social Work drive
  const handleJoinDrive = (driveId: string, role: string = 'General Volunteer') => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id === driveId) {
          const alreadyJoined = d.volunteersJoined.some(
            (v) => v.userId === currentUser.id
          );
          if (alreadyJoined) return d;

          const updated = {
            ...d,
            volunteersJoined: [
              ...d.volunteersJoined,
              {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                role,
                joinedAt: new Date().toISOString(),
                status: 'registered' as const,
              },
            ],
          };

          if (selectedDrive?.id === driveId) {
            setSelectedDrive(updated);
          }
          return updated;
        }
        return d;
      })
    );
  };

  // Handler: Leave drive
  const handleLeaveDrive = (driveId: string) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id === driveId) {
          const updated = {
            ...d,
            volunteersJoined: d.volunteersJoined.filter(
              (v) => v.userId !== currentUser.id
            ),
          };
          if (selectedDrive?.id === driveId) {
            setSelectedDrive(updated);
          }
          return updated;
        }
        return d;
      })
    );
  };

  // Handler: Start social work (in progress)
  const handleStartDrive = (driveId: string) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id === driveId) {
          const updated: SocialDrive = {
            ...d,
            status: 'in_progress',
            workStartedAt: new Date().toISOString(),
          };
          if (selectedDrive?.id === driveId) setSelectedDrive(updated);
          return updated;
        }
        return d;
      })
    );
  };

  // Handler: Complete drive, upload After Photo, award Badges to all volunteers
  const handleCompleteDrive = (
    driveId: string,
    afterPhotoUrl: string,
    actualHours: number,
    notes: string,
    impact: { plasticKg: number; bagsFilled: number; treesPlanted: number }
  ) => {
    const existingDrive = drives.find((d) => d.id === driveId);
    if (!existingDrive) return;

    const completedTarget: SocialDrive = {
      ...existingDrive,
      status: 'completed',
      afterPhotoUrl,
      actualWorkHours: actualHours,
      completionNotes: notes,
      workFinishedAt: new Date().toISOString(),
      impactSummary: {
        plasticKg: impact.plasticKg,
        bagsFilled: impact.bagsFilled,
        treesPlanted: impact.treesPlanted,
      },
      volunteersJoined: existingDrive.volunteersJoined.map((v) => ({
        ...v,
        status: 'work_done',
        hoursLogged: actualHours,
      })),
    };

    setDrives((prev) =>
      prev.map((d) => (d.id === driveId ? completedTarget : d))
    );

    // Group chat is removed from user interface as soon as work is officially Completed
    // The database preserves transcript internally (inaccessible to users)
    archiveAndRemoveGroupChat(
      driveId,
      completedTarget.title,
      completedTarget.volunteersJoined.length
    );

    // If chat was currently open in user view, close it immediately
    if (activeChatDrive?.id === driveId) {
      setActiveChatDrive(null);
    }
    if (selectedDrive?.id === driveId) {
      setSelectedDrive(completedTarget);
    }

    // Award badges to all joined volunteers and update profile achievements
    const newBadgeId = `badge-${Date.now()}`;
    const credentialId = `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const awardedBadge: AwardedBadge = {
      id: newBadgeId,
      driveId,
      driveTitle: completedTarget.title,
      badgeTitle:
        completedTarget.category === 'tree_planting'
          ? 'Urban Planter Star (Gold)'
          : completedTarget.category === 'plastic_cleanup'
          ? 'Eco Warrior Gold (Plastic Remediation)'
          : 'Community Service Champion',
      badgeType: 'gold',
      icon: 'Award',
      hoursContributed: actualHours,
      dateAwarded: new Date().toISOString().split('T')[0],
      issuedTo: currentUser.name,
      credentialId,
      skills: ['Waste Remediation', 'Community Action', 'Environmental Stewardship'],
    };

    setUsers((prev) =>
      prev.map((u) => {
        const wasVolunteer = completedTarget.volunteersJoined.some(
          (v) => v.userId === u.id
        );
        if (wasVolunteer) {
          return {
            ...u,
            totalHours: u.totalHours + actualHours,
            drivesCompleted: u.drivesCompleted + 1,
            badges: [
              {
                ...awardedBadge,
                issuedTo: u.name,
                credentialId: `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              },
              ...u.badges,
            ],
          };
        }
        return u;
      })
    );

    setCompletingDrive(null);
    if (selectedDrive?.id === driveId) {
      setSelectedDrive(completedTarget);
    }

    // Open the Badge modal automatically
    setBadgeModalDrive(completedTarget);
    setActiveBadge(awardedBadge);
  };

  const userRadius = currentUser.searchRadiusKm || 20;
  const userCoords = currentUser.locationCoords || { lat: 19.0596, lng: 72.8295, label: currentUser.city };

  // Drives within user's configured search radius
  const matchingRadiusDrives = drives.filter((drive) => {
    const dist = calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      drive.location.lat,
      drive.location.lng
    );
    return dist <= userRadius;
  });

  // Filtered drives logic
  const filteredDrives = drives.filter((drive) => {
    // Search radius filter if user chose to view only within radius
    if (filterByRadiusOnly) {
      const dist = calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        drive.location.lat,
        drive.location.lng
      );
      if (dist > userRadius) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        drive.title.toLowerCase().includes(q) ||
        drive.description.toLowerCase().includes(q) ||
        (drive.customCategoryName && drive.customCategoryName.toLowerCase().includes(q)) ||
        (drive.beneficiaryGroup && drive.beneficiaryGroup.toLowerCase().includes(q)) ||
        drive.category.toLowerCase().includes(q) ||
        drive.location.address.toLowerCase().includes(q) ||
        drive.location.landmark.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    // Category / Status Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'women_safety') return drive.womenSafety.guaranteed;
    if (activeFilter === 'in_progress') return drive.status === 'in_progress';
    if (activeFilter === 'completed') return drive.status === 'completed';
    return drive.category === activeFilter;
  });

  const totalNetworkHours = users.reduce((acc, u) => acc + u.totalHours, 0);

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col text-stone-900 selection:bg-emerald-300 selection:text-emerald-950 font-sans">
      {/* Google Maps Quota Notification Banner */}
      {quotaExceeded && (
        <div className="bg-amber-100 border-b-2 border-amber-300 text-amber-950 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 font-medium">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenCreate={() => setIsCreatingDrive(true)}
        onOpenProfile={() => setIsViewingProfile(true)}
        onOpenDistanceModal={() => setIsSelectingDistance(true)}
        onOpenYouTubeKit={() => setIsYouTubeKitOpen(true)}
        totalNetworkHours={totalNetworkHours}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        filterByRadiusOnly={filterByRadiusOnly}
        onToggleFilterByRadius={() => setFilterByRadiusOnly((prev) => !prev)}
        matchingRadiusCount={matchingRadiusDrives.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Distance Search Radius Indicator Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white border-2 border-stone-900/10 shadow-[2px_2px_0px_#10b981] text-xs text-stone-700">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-emerald-400 flex items-center justify-center shrink-0 border border-stone-900 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-stone-950 flex items-center gap-2 font-display text-sm">
                <span>Community Radar: Within {userRadius} km of {userCoords.label || currentUser.city}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-mono-code font-bold uppercase tracking-wide border border-emerald-300">
                  Max 50 km
                </span>
              </div>
              <p className="text-stone-500 text-xs mt-0.5 font-sans">
                <strong className="text-emerald-700 font-mono-code">{matchingRadiusDrives.length} active initiatives</strong> nearby ready for you to show up & help out.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setFilterByRadiusOnly((prev) => !prev)}
              className={`px-3.5 py-2 rounded-2xl font-bold font-mono-code transition-all text-xs flex items-center gap-1.5 border-2 ${
                filterByRadiusOnly
                  ? 'bg-stone-950 text-emerald-300 border-stone-950 shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300/80'
              }`}
            >
              <span>{filterByRadiusOnly ? '⚡ Active Zone Only' : `Show ≤ ${userRadius}km`}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSelectingDistance(true)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold flex items-center gap-1.5 text-xs transition-all border-2 border-stone-900/20 shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Change Radar</span>
            </button>
          </div>
        </div>

        {/* Hero Banner: Gen Z Aesthetic Social Work Manifesto */}
        <section className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-7 sm:p-12 border-2 border-stone-950 shadow-[4px_4px_0px_#10b981]">
          {/* Subtle noise/grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b98130_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide font-mono-code uppercase sticker-badge">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>✦ IRL Community Action • Zero Cap • Pure Impact</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] font-display text-white">
              See the need. Squad up. <br />
              <span className="text-emerald-400 underline decoration-wavy decoration-emerald-500/50">Clean the streets IRL.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-sans">
              Spot a polluted shoreline, elderly shelter needing hands, or a tree plantation spot? Post 1 photo, set the daylight hours, and coordinate live. Zero corporate greenwashing. 100% public good with live Google Maps tracking and verifiable LinkedIn credentials.
            </p>

            {/* Core Commitments Chips / Sticker Badges & YouTube Marketing Hub */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold">
              <button
                type="button"
                onClick={() => setIsYouTubeKitOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff0000] hover:bg-[#dd0000] text-white border-2 border-stone-950 font-display font-black shadow-[2px_2px_0px_#fff] active:translate-y-0.5 transition-all sticker-badge"
                title="Open YouTube Marketing Playbook, Viral Shorts Scripts & Video Ideas"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>YouTube Creator Kit</span>
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-400 text-stone-950 border border-emerald-300 sticker-badge">
                <BadgeCheck className="w-3.5 h-3.5 text-stone-950" />
                <span>Zero Profit Verified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>1 Mandatory Before Photo</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Squad Chat (Varp-Seals on Finish)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Women Safety Buddies</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight Only (Safety 1st)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Search & Location Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives, beach cleanups, food drives..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-stone-900/10 focus:border-stone-950 focus:outline-hidden shadow-xs font-sans"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs text-stone-500 font-medium">
            <span>
              Showing <strong className="font-mono-code text-stone-900 font-bold">{filteredDrives.length}</strong> active initiatives
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingDrive(true)}
              className="inline-flex items-center gap-1.5 text-stone-950 hover:text-emerald-600 font-extrabold font-display transition-colors"
            >
              <span>+ Post Need for Cleanup</span>
            </button>
          </div>
        </section>

        {/* Grid of Social Work Drives */}
        <section>
          {filteredDrives.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-stone-200 bg-white space-y-3">
              <Camera className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">
                No social work drives match your filter
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Be the first to post 1 photo of an area that needs plastic cleanup or tree plantation in your neighborhood!
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingDrive(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
              >
                Post Social Work Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrives.map((drive) => (
                <DriveCard
                  key={drive.id}
                  drive={drive}
                  currentUser={currentUser}
                  onSelectDrive={(d) => setSelectedDrive(d)}
                  onQuickJoin={(driveId) => handleJoinDrive(driveId)}
                  onOpenChat={(d) => setActiveChatDrive(d)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Live Chat Action for active drive coordination */}
      {!activeChatDrive && drives.some((d) => d.status !== 'completed') && (
        <div className="fixed bottom-5 right-5 z-30">
          <button
            type="button"
            onClick={() => {
              const target =
                selectedDrive && selectedDrive.status !== 'completed'
                  ? selectedDrive
                  : drives.find((d) => d.status !== 'completed');
              if (target) setActiveChatDrive(target);
            }}
            className="px-4 py-3 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white font-extrabold text-xs sm:text-sm shadow-[3px_3px_0px_#10b981] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border-2 border-stone-950 font-display"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <MessageSquare className="w-4 h-4" />
            <span>Live Squad Chat</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-900/10 bg-white/70 py-8 text-xs text-stone-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-stone-950 font-display text-sm">CleanMeet.</span>
            <span>• Hyperlocal Volunteer Action for Gen Z & Communities</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-500">
            <span>Google Maps GPS Tracking</span>
            <span>•</span>
            <span>Daytime Verified</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsYouTubeKitOpen(true)}
              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold transition-colors font-mono-code"
              title="YouTube Marketing & Creator Launch Playbook"
            >
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>YouTube Creator Kit</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsInternalVaultOpen(true)}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-emerald-700 font-bold transition-colors font-mono-code"
              title="Inspect Internal Compliance Database"
            >
              <Database className="w-3.5 h-3.5 text-stone-500" />
              <span>Internal Database Vault</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Drive Detail & Route Tracking Modal */}
      {selectedDrive && (
        <DriveDetailModal
          drive={selectedDrive}
          currentUser={currentUser}
          onClose={() => setSelectedDrive(null)}
          onJoin={(driveId, role) => handleJoinDrive(driveId, role)}
          onLeave={(driveId) => handleLeaveDrive(driveId)}
          onStartDrive={(driveId) => handleStartDrive(driveId)}
          onOpenCompletion={(drive) => setCompletingDrive(drive)}
          onOpenBadge={(drive) => {
            setBadgeModalDrive(drive);
            setActiveBadge(undefined);
          }}
          onOpenChat={(drive) => setActiveChatDrive(drive)}
          onOpenInternalVault={() => setIsInternalVaultOpen(true)}
        />
      )}

      {/* 2. Group Chat Modal - Opens as soon as post created, removed when completed */}
      {activeChatDrive && (
        <GroupChatModal
          drive={activeChatDrive}
          currentUser={currentUser}
          isOpen={Boolean(activeChatDrive)}
          onClose={() => setActiveChatDrive(null)}
          onOpenInternalVault={() => {
            setActiveChatDrive(null);
            setIsInternalVaultOpen(true);
          }}
        />
      )}

      {/* 3. Internal Database Chat Vault Modal (Compliance verification) */}
      {isInternalVaultOpen && (
        <InternalChatVaultModal
          isOpen={isInternalVaultOpen}
          onClose={() => setIsInternalVaultOpen(false)}
        />
      )}

      {/* 4. Create / Post Drive Modal */}
      {isCreatingDrive && (
        <CreateDriveModal
          currentUser={currentUser}
          onClose={() => setIsCreatingDrive(false)}
          onCreateDrive={handleCreateDrive}
        />
      )}

      {/* 5. Complete Drive & Upload After Photo Modal */}
      {completingDrive && (
        <CompletionModal
          drive={completingDrive}
          currentUser={currentUser}
          onClose={() => setCompletingDrive(null)}
          onCompleteDrive={handleCompleteDrive}
        />
      )}

      {/* 6. Verifiable Badge & LinkedIn Certificate Modal */}
      {badgeModalDrive && (
        <BadgeCertificateModal
          drive={badgeModalDrive}
          currentUser={currentUser}
          badge={activeBadge}
          onClose={() => {
            setBadgeModalDrive(null);
            setActiveBadge(undefined);
          }}
        />
      )}

      {/* 7. User Profile & Achievements Modal */}
      {isViewingProfile && (
        <UserProfileModal
          currentUser={currentUser}
          completedDrives={drives.filter((d) => d.status === 'completed')}
          allDrives={drives}
          onClose={() => setIsViewingProfile(false)}
          onOpenBadge={(drive, badge) => {
            setBadgeModalDrive(drive);
            setActiveBadge(badge);
          }}
          onUpdateRadius={handleSaveRadius}
          onSelectDrive={(drive) => {
            setIsViewingProfile(false);
            setSelectedDrive(drive);
          }}
        />
      )}

      {/* 8. Distance Search Preference Modal (Max 50 km) */}
      {isSelectingDistance && (
        <DistanceSelectionModal
          currentUser={currentUser}
          allDrives={drives}
          onSaveRadius={handleSaveRadius}
          onClose={() => setIsSelectingDistance(false)}
          isInitialSignIn={!currentUser.hasConfiguredRadius}
        />
      )}

      {/* 9. YouTube Creator Launch & Marketing Playbook Modal */}
      {isYouTubeKitOpen && (
        <YouTubeMarketingModal
          isOpen={isYouTubeKitOpen}
          onClose={() => setIsYouTubeKitOpen(false)}
          featuredDrive={selectedDrive || drives[0]}
        />
      )}
    </div>
  );
}
