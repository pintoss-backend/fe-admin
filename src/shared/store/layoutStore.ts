import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	toggleCollapsed: () => void;
}

export const useLayoutStore = create<LayoutState>()(
	persist(
		(set) => ({
			collapsed: false,
			setCollapsed: (collapsed) => set({ collapsed }),
			toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
		}),
		{
			name: 'layout-storage',
		},
	),
);
