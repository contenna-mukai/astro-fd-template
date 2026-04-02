import { defineConfig } from 'astro/config';
import path from 'path';
import { pathToFileURL } from 'url';

const scriptsDir = path.resolve('./src/assets/scripts');
const pagesDir = 'virtual:astro:page:src/pages/';

const getPageCssPath = (originalFileName) => {
	if (!originalFileName?.startsWith(pagesDir)) {
		return null;
	}

	const pagePath = originalFileName
		.slice(pagesDir.length)
		.replace(/@_@astro$/, '')
		.replace(/\/index$/, '/index')
		.replace(/^index$/, 'index');

	return `${pagePath}.css`;
};

const getScriptEntryModuleId = (chunkInfo) => {
	const scriptModuleIds = chunkInfo.moduleIds.filter((file) => file.startsWith(scriptsDir) && file.endsWith('.js'));

	if (scriptModuleIds.length === 0) {
		return null;
	}

	return scriptModuleIds.find((file) => file.endsWith('/common.js')) ?? scriptModuleIds.find((file) => file.includes('/pages/')) ?? scriptModuleIds.find((file) => !file.includes('/utils/')) ?? scriptModuleIds[0];
};

const assetFileNames = (assetInfo) => {
	const pageCssPath = getPageCssPath(assetInfo.originalFileName);

	const transformedPath = pageCssPath ?? assetInfo.name.replace(/@_@astro(?=\.css$)/, '').replace(/\/([^\/]+\.styles)$/, '/$1');

	const fileName = assetInfo.name.includes('BaseLayout') ? 'common.css' : transformedPath;

	return `assets/styles/${fileName}`;
};

const clientRollupOutput = {
	assetFileNames,
	entryFileNames: (chunkInfo) => {
		const scriptModuleId = getScriptEntryModuleId(chunkInfo);
		const pathName = chunkInfo.moduleIds.length !== 0 && ((scriptModuleId ?? chunkInfo.moduleIds[0]).includes('hoisted') ? 'hoisted' : path.relative(scriptsDir, scriptModuleId ?? chunkInfo.moduleIds.find((file) => file.endsWith('.js')))).replace('.js', '').replace('pages/', '');

		return `assets/scripts/${pathName ? pathName : 'hoisted'}.js`;
	},
	chunkFileNames: () => {
		return `js/[name].js`;
	},
	manualChunks(id) {
		if (id.includes('node_modules')) {
			return 'assets/scripts/vendor';
		}
	},
};

export default defineConfig({
	site: 'https://sample.com/',
	base: '/',
	outDir: './dist',
	compressHTML: false,
	build: {
		format: 'preserve',
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					importers: [
						{
							findFileUrl(url) {
								if (!url.startsWith('@/')) {
									return null;
								}

								return new URL(url.slice(2), `${pathToFileURL(path.resolve('./src')).href}/`);
							},
						},
					],
				},
			},
		},
		resolve: {
			alias: {
				'@': path.resolve('./src'),
			},
		},
		build: {
			assetsInlineLimit: 0,
			rollupOptions: {
				output: {
					assetFileNames,
				},
			},
		},
		environments: {
			client: {
				build: {
					rollupOptions: {
						output: clientRollupOutput,
					},
				},
			},
		},
	},
});
