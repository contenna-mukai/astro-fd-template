import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
	site: 'https://sample.com/',
	base: '/',
	outDir: './dist',
	compressHTML: false,
	build: {
		format: 'preserve',
	},
	vite: {
		build: {
			assetsInlineLimit: 0,
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						const transformedPath = assetInfo.name.includes('/') ? assetInfo.name.replace(/\/([^\/]+\.styles)$/, '/$1') : `${assetInfo.name}`;

						const fileName = assetInfo.name.includes('BaseLayout') ? 'common.css' : transformedPath;

						return `assets/styles/${fileName}`;
					},
					entryFileNames: (chunkInfo) => {
						const pathName =
							chunkInfo.moduleIds.length !== 0 &&
							(chunkInfo.moduleIds[0].includes('hoisted')
								? 'hoisted'
								: path.relative(
										'./src/assets/scripts/',
										chunkInfo.moduleIds.find((file) => file.endsWith('.js')),
									)
							)
								.replace('.js', '')
								.replace('pages/', '');

						return `assets/scripts/${pathName ? pathName : 'hoisted'}.js`;
					},
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return 'assets/scripts/vendor';
						}
					},
				},
			},
		},
	},
	integrations: [
		{
			name: 'chunkFileNames-for-client',
			hooks: {
				'astro:build:setup': ({ vite, target }) => {
					if (target === 'client') {
						vite.build.rollupOptions.output.chunkFileNames = () => {
							return `js/[name].js`;
						};
					}
				},
			},
		},
	],
});
