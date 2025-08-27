import { message } from 'antd';

// 토스트 메시지 전역 설정
export const configureMessage = () => {
	message.config({
		top: 100, // 상단에서 100px 떨어진 위치
		duration: 2, // 2초간 표시 (더 빠르게)
		maxCount: 3, // 최대 3개까지 표시
		rtl: false, // 왼쪽에서 오른쪽으로 표시
	});
};
