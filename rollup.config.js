import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.ts',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'WCL',
  },
  plugins: [typescript()],
}
