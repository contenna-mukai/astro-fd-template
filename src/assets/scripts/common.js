import { calculateViewportContent } from './utils/viewport';
import '@/assets/styles/common.scss';

const minWidth = 375;

/**
 * Viewportの自動調整機能を初期化
 */
const initViewport = () => {
	const metaEl = document.querySelector('meta[name="viewport"]');

	if (!metaEl) return;

	const updateContent = () => {
		const content = calculateViewportContent(window.screen.width, minWidth);
		metaEl.setAttribute('content', content);
	};

	updateContent();

	window.addEventListener('orientationchange', updateContent);
};

initViewport();
