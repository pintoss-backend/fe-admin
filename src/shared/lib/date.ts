export const KSTformatter = new Intl.DateTimeFormat('ko-KR', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: 'Asia/Seoul',
});

export const fmtDateTime = (iso: string) => {
	if (!iso) return '';

	const date = new Date(iso);
	if (isNaN(date.getTime())) return '';

	return KSTformatter.format(date);
};
