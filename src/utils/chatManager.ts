import { ChatMessage, GroupChatRoom, InternalArchivedChatRecord, SocialDrive, UserProfile } from '../types';

const ACTIVE_CHATS_STORAGE_KEY = 'cleanmeet_active_group_chats_v1';
const INTERNAL_VAULT_STORAGE_KEY = 'cleanmeet_internal_chat_vault_v1';

// Initial seed chats for active drives
export const INITIAL_SEED_CHATS: Record<string, GroupChatRoom> = {
  'drive-1': {
    driveId: 'drive-1',
    driveTitle: 'Mahim Bay Mangrove Plastic & Single-Use Waste Clearance',
    status: 'active',
    createdAt: '2026-09-19T07:00:00Z',
    lastMessageAt: '2026-09-19T08:15:00Z',
    participantsCount: 14,
    messages: [
      {
        id: 'msg-1-1',
        driveId: 'drive-1',
        senderId: 'system',
        senderName: 'CleanMeet Coordinator',
        senderAvatar: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=150&auto=format&fit=crop&q=80',
        senderRole: 'System',
        text: 'Group chat automatically opened upon drive creation. Daylight hours enforced. Zero commercial profit covenant signed.',
        timestamp: '2026-09-19T07:00:00Z',
        isSystemNotice: true,
      },
      {
        id: 'msg-1-2',
        driveId: 'drive-1',
        senderId: 'user-priya',
        senderName: 'Priya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Organizer & Lead',
        text: 'Hello team! Heavy-duty nitrile gloves, bio-sacks, and drinking water jars will be stationed at the Mahim Causeway bus depot meetup point.',
        timestamp: '2026-09-19T07:15:00Z',
      },
      {
        id: 'msg-1-3',
        driveId: 'drive-1',
        senderId: 'user-priya',
        senderName: 'Priya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Women Safety Lead',
        text: 'Women Safety Protocol: I am the dedicated safety lead. Buddy system will be assigned before entering the shoreline. Restrooms available at the petrol pump 150m away.',
        timestamp: '2026-09-19T07:30:00Z',
      },
      {
        id: 'msg-1-4',
        driveId: 'drive-1',
        senderId: 'user-rahul',
        senderName: 'Rahul Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Volunteer',
        text: 'Noted Priya! Bringing 4 extra steel tongs and a first-aid kit in my backpack. See everyone at 8:30 AM sharp.',
        timestamp: '2026-09-19T08:15:00Z',
      },
    ],
  },
  'drive-8': {
    driveId: 'drive-8',
    driveTitle: 'Dharavi Slum Community Library & Digital Literacy Drive',
    status: 'active',
    createdAt: '2026-09-19T08:00:00Z',
    lastMessageAt: '2026-09-19T09:45:00Z',
    participantsCount: 8,
    messages: [
      {
        id: 'msg-8-1',
        driveId: 'drive-8',
        senderId: 'system',
        senderName: 'CleanMeet Coordinator',
        senderAvatar: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=150&auto=format&fit=crop&q=80',
        senderRole: 'System',
        text: 'Group chat opened for community volunteer coordination. All 300 books provided 100% free; zero commercial coaching fees.',
        timestamp: '2026-09-19T08:00:00Z',
        isSystemNotice: true,
      },
      {
        id: 'msg-8-2',
        driveId: 'drive-8',
        senderId: 'user-priya',
        senderName: 'Priya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Education Lead',
        text: 'Welcome volunteers! The community center hall is opened. We will sort books by age category (6-9 and 10-14) first, then begin the tablet orientation.',
        timestamp: '2026-09-19T08:20:00Z',
      },
      {
        id: 'msg-8-3',
        driveId: 'drive-8',
        senderId: 'user-rahul',
        senderName: 'Rahul Mehta',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Tech Setup',
        text: 'Tablets are fully pre-charged with offline educational math and reading apps installed.',
        timestamp: '2026-09-19T09:45:00Z',
      },
    ],
  },
  'drive-9': {
    driveId: 'drive-9',
    driveTitle: 'Street Animal Welfare: Anti-Rabies Vaccination & Reflective Collar Safety Drive',
    status: 'active',
    createdAt: '2026-09-19T11:00:00Z',
    lastMessageAt: '2026-09-19T11:30:00Z',
    participantsCount: 6,
    messages: [
      {
        id: 'msg-9-1',
        driveId: 'drive-9',
        senderId: 'system',
        senderName: 'CleanMeet Coordinator',
        senderAvatar: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=150&auto=format&fit=crop&q=80',
        senderRole: 'System',
        text: 'Group chat opened upon initiative publication. Volunteer vets on site. All collars and medical aid provided 100% free.',
        timestamp: '2026-09-19T11:00:00Z',
        isSystemNotice: true,
      },
      {
        id: 'msg-9-2',
        driveId: 'drive-9',
        senderId: 'user-ananya',
        senderName: 'Ananya Deshmukh',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        senderRole: 'Animal Welfare Lead',
        text: 'Hi everyone, 50 reflective glow-collars and safe treats are ready. Please wear sturdy closed shoes or boots for park grass.',
        timestamp: '2026-09-19T11:30:00Z',
      },
    ],
  },
};

/**
 * Loads all active user-accessible chats from storage or seeds
 */
export function getActiveGroupChats(): Record<string, GroupChatRoom> {
  try {
    const raw = localStorage.getItem(ACTIVE_CHATS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load active chats from localStorage:', err);
  }
  return { ...INITIAL_SEED_CHATS };
}

/**
 * Saves active user-accessible chats
 */
export function saveActiveGroupChats(chats: Record<string, GroupChatRoom>): void {
  try {
    localStorage.setItem(ACTIVE_CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (err) {
    console.warn('Failed to save active chats:', err);
  }
}

/**
 * Creates and initializes a new group chat as soon as a social work post is created.
 * Automatically opens for volunteer coordination.
 */
export function initializeGroupChatForNewDrive(
  drive: SocialDrive,
  creator: UserProfile
): GroupChatRoom {
  const activeChats = getActiveGroupChats();

  const welcomeMessage: ChatMessage = {
    id: `msg-${Date.now()}-system`,
    driveId: drive.id,
    senderId: 'system',
    senderName: 'CleanMeet Safety & Operations',
    senderAvatar: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=150&auto=format&fit=crop&q=80',
    senderRole: 'System',
    text: `Group chat automatically opened for "${drive.title}". All communications are restricted to daytime coordination, volunteer safety, and community betterment. When this drive is officially marked Completed, this live chat will be permanently retired from the user interface and archived internally into non-profit compliance records.`,
    timestamp: new Date().toISOString(),
    isSystemNotice: true,
  };

  const organizerOpeningMessage: ChatMessage = {
    id: `msg-${Date.now()}-organizer`,
    driveId: drive.id,
    senderId: creator.id,
    senderName: creator.name,
    senderAvatar: creator.avatar,
    senderRole: 'Organizer & Lead',
    text: `Welcome everyone to our ${drive.customCategoryName || drive.category} drive! Meeting point is "${drive.location.landmark || drive.location.address}". We start promptly at ${drive.startTime}. Women safety lead assigned: ${drive.womenSafety.safetyLeadName}. Feel free to drop any questions or arrival updates below!`,
    timestamp: new Date().toISOString(),
  };

  const newChatRoom: GroupChatRoom = {
    driveId: drive.id,
    driveTitle: drive.title,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    participantsCount: drive.volunteersJoined.length || 1,
    messages: [welcomeMessage, organizerOpeningMessage],
  };

  activeChats[drive.id] = newChatRoom;
  saveActiveGroupChats(activeChats);
  return newChatRoom;
}

/**
 * Sends a message in an active group chat
 */
export function sendMessageToDriveChat(
  driveId: string,
  sender: UserProfile,
  text: string,
  role?: string
): GroupChatRoom | null {
  const activeChats = getActiveGroupChats();
  const chat = activeChats[driveId];
  if (!chat || chat.status !== 'active') {
    return null;
  }

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    driveId,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    senderRole: role || (sender.id === 'user-priya' ? 'Organizer' : 'Volunteer'),
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  chat.messages.push(newMessage);
  chat.lastMessageAt = newMessage.timestamp;
  activeChats[driveId] = chat;
  saveActiveGroupChats(activeChats);
  return chat;
}

/**
 * As soon as work is officially Completed:
 * 1. The live group chat is completely REMOVED from the user interface.
 * 2. The chat transcript is preserved in the internal database vault (inaccessible to regular users).
 */
export function archiveAndRemoveGroupChat(
  driveId: string,
  driveTitle: string,
  participantsCount: number
): InternalArchivedChatRecord | null {
  const activeChats = getActiveGroupChats();
  const existingChat = activeChats[driveId];

  const transcript = existingChat ? [...existingChat.messages] : [];

  // Add system completion seal to transcript
  transcript.push({
    id: `msg-${Date.now()}-closed`,
    driveId,
    senderId: 'system',
    senderName: 'CleanMeet Compliance Engine',
    senderAvatar: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=150&auto=format&fit=crop&q=80',
    senderRole: 'System',
    text: `Work Officially Completed at ${new Date().toLocaleTimeString()}. Live chat is permanently decommissioned from the user interface. Transcript sealed and archived into the internal audit vault.`,
    timestamp: new Date().toISOString(),
    isSystemNotice: true,
  });

  const archivedRecord: InternalArchivedChatRecord = {
    driveId,
    driveTitle,
    closedAt: new Date().toISOString(),
    reason: 'work_officially_completed',
    totalMessagesCount: transcript.length,
    participantsCount,
    encryptedTranscriptPayload: transcript,
    internalAuditHash: `CM-INTERNAL-VAULT-HASH-${driveId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    isInternalOnly: true, // Internal database only, unavailable to user
  };

  // 1. Store internally in database vault (not available to regular users)
  try {
    const rawVault = localStorage.getItem(INTERNAL_VAULT_STORAGE_KEY);
    const vaultRecords: InternalArchivedChatRecord[] = rawVault ? JSON.parse(rawVault) : [];
    const filtered = vaultRecords.filter((r) => r.driveId !== driveId);
    filtered.unshift(archivedRecord);
    localStorage.setItem(INTERNAL_VAULT_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to archive chat into internal vault:', err);
  }

  // 2. Remove completely from user-accessible active chats
  delete activeChats[driveId];
  saveActiveGroupChats(activeChats);

  return archivedRecord;
}

/**
 * Returns whether a drive's chat is currently active in the user interface
 */
export function isDriveChatActive(driveId: string, driveStatus: string): boolean {
  if (driveStatus === 'completed') {
    return false; // Removed as soon as work is officially completed
  }
  const activeChats = getActiveGroupChats();
  return Boolean(activeChats[driveId]);
}

/**
 * Strictly internal query for database compliance audit verification.
 * Not exposed to regular user workflows.
 */
export function getInternalArchivedChatVault(): InternalArchivedChatRecord[] {
  try {
    const raw = localStorage.getItem(INTERNAL_VAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
