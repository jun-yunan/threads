import { create } from 'zustand';

type CreateNewFeedState = {
  openDialog: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useCreateNewFeed = create<CreateNewFeedState>((set) => ({
  openDialog: false,
  onOpenChange: (open) => set({ openDialog: open }),
}));
