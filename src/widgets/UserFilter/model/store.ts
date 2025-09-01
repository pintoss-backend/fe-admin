import { create } from 'zustand';

export type StatusFilter = 'ALL' | 'ACTIVE' | 'BLOCKED' | 'WITHDRAWN';

interface FiltersState {
	q: string;
	status: StatusFilter;
	setQ: (v: string) => void;
	setStatus: (s: StatusFilter) => void;
	reset: () => void;
}

export const useMembersFilters = create<FiltersState>((set) => ({
	q: '',
	status: 'ALL',
	setQ: (v) => set({ q: v }),
	setStatus: (status) => set({ status }),
	reset: () => set({ q: '', status: 'ALL' }),
}));
