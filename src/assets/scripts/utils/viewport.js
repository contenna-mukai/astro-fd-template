/**
 * 画面幅に応じて適切なViewportのcontent属性値を算出する
 * @param {number} screenWidth - window.screen.width
 * @param {number} [minWidth=375] - 固定幅にする閾値
 * @returns {string}
 */
export const calculateViewportContent = (screenWidth, minWidth = 375) => {
	return screenWidth < minWidth ? `width=${minWidth}` : 'width=device-width';
};
