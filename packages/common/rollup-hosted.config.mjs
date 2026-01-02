import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'index.ts',
    output: {
      file: 'dist/node/index.js',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true,
    },
    plugins: [
      resolve({ browser: false, preferBuiltins: true }),
      commonjs(),
      terser(),
      typescript({
        tsconfig: 'tsconfig.json',
      }),
    ],
  },
  {
    input: 'src/index.hosted.ts',
    output: {
      file: 'dist/dbi/index.js',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true,
    },
    plugins: [
      resolve({ browser: false, preferBuiltins: true }),
      commonjs(),
      terser(),
      typescript({ declaration: false }),
    ],
  },
]
