import { Doc, Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { create } from 'zustand';

export type ModalType = 'deletePost' | 'createPost' | 'updateProfile';

interface ModalData {
  postId?: Id<'posts'>;
  post?: Doc<'posts'>;
  user?: Doc<'users'>;
  userByUsername?: typeof api.users.getUserByUsername._returnType;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
