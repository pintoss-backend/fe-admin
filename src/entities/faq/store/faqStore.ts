import { create } from 'zustand';
import type { Faq, FaqCreateInput } from '@/entities/faq/model';
import { listFaqsMock, createFaqMock, deleteFaqMock } from '@/entities/faq/api';

type State = {
	items: Faq[];
	loading: boolean;
	submitting: boolean;
	error?: string | null;
};

type Actions = {
	fetchList: () => Promise<void>;
	createOne: (values: FaqCreateInput) => Promise<Faq>;
	removeOne: (id: string) => Promise<void>;
	setItems: (next: Faq[]) => void;
};

export const useFaqStore = create<State & Actions>((set, get) => ({
	items: [],
	loading: false,
	submitting: false,
	error: null,

	fetchList: async () => {
		set({ loading: true, error: null });
		try {
			const data = await listFaqsMock();
			set({ items: data });
		} finally {
			set({ loading: false });
		}
	},

	createOne: async (values) => {
		set({ submitting: true });
		try {
			const created = await createFaqMock(values);
			set({ items: [created, ...get().items] });
			return created;
		} finally {
			set({ submitting: false });
		}
	},

	removeOne: async (id) => {
		await deleteFaqMock(id);
		set({ items: get().items.filter((f) => f.id !== id) });
	},

	setItems: (next) => set({ items: next }),
}));
