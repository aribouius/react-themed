import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

const env = process.env.NODE_ENV

const config = {
  entry: 'src/index.js',
  moduleName: 'ReactThemed',
  format: 'umd',
  external: [
    'react',
  ],
  globals: {
    'react': 'React',
  },
  plugins: [
    nodeResolve(),
    babel({ exclude: '**/node_modules/**' }),
    commonjs(),
  ],
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config
