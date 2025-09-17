export const cmpStrKo = (a: string, b: string) => a.localeCompare(b, 'ko-KR');
export const cmpDateIso = (aIso: string, bIso: string) =>
	new Date(aIso).getTime() - new Date(bIso).getTime();
