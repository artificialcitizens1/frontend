import { create } from "zustand";

interface feedState {
  feeds: any[];

  // Actions
  setFeeds: (feeds: any[]) => void;

  // Reset function
  reset: () => void;

}

export const useFeedStore = create<feedState>((set, _get) => ({
  feeds: [],
  setFeeds: (feeds) => set({ feeds: feeds }),
  reset: () => set({ feeds: [] }),
}));
