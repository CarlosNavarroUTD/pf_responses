// src/hooks/useTeams.ts
import { create } from 'zustand';
import { teamsService } from '@/services/teams.service';

interface Team {
  id: number;
  name: string;
  description?: string;
}

interface Member {
  id: number;
  email: string;
  name: string;
}

interface InviteMemberData {
  email?: string;
  phone?: string;
}

interface TeamsStore {
  teams: Team[];
  members: Record<number, Member[]>;
  isLoading: boolean;
  fetchTeams: () => Promise<void>;
  createTeam: (data: { name: string; description?: string }) => Promise<void>;
  getTeamMembers: (teamId: number) => Promise<void>;
  inviteMember: (teamId: number, data: { email?: string; phone?: string }) => Promise<void>;
  leaveTeam: (teamId: number) => Promise<void>;
  removeMember: (teamId: number, userId: number) => Promise<void>;
}

const validateInviteData = (data: InviteMemberData): string | null => {
  if (!data.email && !data.phone) {
    return 'Se requiere email o teléfono';
  }
  
  if (data.email && data.phone) {
    return 'Debe proporcionar solo email o teléfono, no ambos';
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Email inválido';
  }
  
  if (data.phone && !/^\+?[\d\s-]{8,}$/.test(data.phone)) {
    return 'Teléfono inválido';
  }
  
  return null;
};

export const useTeams = create<TeamsStore>((set, get) => ({
  teams: [],
  members: {},
  isLoading: false,

  fetchTeams: async () => {
    try {
      set({ isLoading: true });
      const teams = await teamsService.getMyTeams();
      set({ teams, isLoading: false });
    } catch (error) {
      console.error('Error fetching teams:', error);
      set({ isLoading: false });
    }
  },

  createTeam: async (data) => {
    try {
      set({ isLoading: true });
      await teamsService.createTeam(data);
      await get().fetchTeams(); // Refresh the list
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getTeamMembers: async (teamId: number) => {
    try {
      set({ isLoading: true });
      const members = await teamsService.getTeamMembers(teamId);
      set((state) => ({
        members: { ...state.members, [teamId]: members },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      set({ isLoading: false });
    }
  },

  inviteMember: async (teamId: number, data: InviteMemberData) => {
    try {
      const validationError = validateInviteData(data);
      if (validationError) {
        throw new Error(validationError);
      }

      set({ isLoading: true });
      await teamsService.inviteMember(teamId, data);
      await get().getTeamMembers(teamId); // Refresh members list
    } catch (error) {
      console.error('Error inviting member:', error);
      throw error; // Re-throw to handle in the component
    } finally {
      set({ isLoading: false });
    }
  },

  leaveTeam: async (teamId: number) => {
    try {
      set({ isLoading: true });
      await teamsService.leaveTeam(teamId);
      await get().fetchTeams(); // Refresh teams list
    } catch (error) {
      console.error('Error leaving team:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeMember: async (teamId: number, userId: number) => {
    try {
      set({ isLoading: true });
      await teamsService.removeMember(teamId, userId);
      await get().getTeamMembers(teamId); // Refresh members list
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));