// rollup.config.mjs
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import path from 'node:path';
import { fileURLToPath } from 'node:url'
import {glob} from 'glob';

const entries = glob.sync('src/main/**/*.js');

export default entries.map(file => {
		const inputFileName = path.relative(
			'src',
			file.slice(0, file.length - path.extname(file).length)
		);
	
		const inputFilePath = fileURLToPath(new URL(file, import.meta.url));

		return {
			input: {
				[inputFileName]: inputFilePath
			},
			output: {
				entryFileNames: '[name].js',
				dir: 'dist'
			},
			plugins: [
				alias({
					entries: [
						{ find: '@', replacement: fileURLToPath(new URL('src', import.meta.url)) }
					]
				}),
				commonjs(),
				resolve(),
        clear({
          targets: ['dist']
        }),
        copy({
          targets: [
            { src: 'src/manifest.json', dest: 'dist' },
            { src: 'src/images/*', dest: 'dist/images' },
            { src: 'src/pages/*', dest: 'dist/pages' },
          ]
        })
			]
		}
	});