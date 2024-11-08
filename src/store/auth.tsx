import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: Session | null;
  profileId: number;
  profile: IProfile | undefined;
  profilePicture: string;
  profileFollowing: any[];
  setProfilePicture: (profilePicture: string) => void;
  setUserSession: (user: Session | null) => void;
  setProfileIdGlobal: (profileId: number) => void;
  setProfileGlobal: (profile: IProfile | undefined) => void;
  setProfileFollowing: (profileFollowing: any[]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: {} as Session | null,
      setUserSession: user => set(() => ({ user: user })),
      clearUser: () => set(() => ({ user: {} as Session | null })),
      profileId: 0 as number,
      setProfileIdGlobal: profileId => set(() => ({ profileId: profileId })),
      profile: {} as IProfile | undefined,
      setProfileGlobal: profile => set(() => ({ profile: profile })),
      profilePicture: '' as string,
      setProfilePicture: profilePicture => set(() => ({ profilePicture: profilePicture })),
      profileFollowing: [] as any[],
      setProfileFollowing: profileFollowing => set(() => ({ profileFollowing : profileFollowing }))
    }),
    {
      name: 'auth-storage'
    }
  )
);
