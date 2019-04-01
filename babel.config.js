module.exports = api => {
  const babelEnv = api.env()

  api.cache.using(() => (babelEnv === 'es' || babelEnv === 'commonjs'))

  const presets = [
    ['@babel/preset-env', { modules: false, targets: '>1%, not op_mini all' }],
    '@babel/preset-react',
  ]
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
  ]

  if (babelEnv === 'test' || babelEnv === 'commonjs') {
    plugins.push(['@babel/plugin-transform-modules-commonjs', { loose: true }])
  }

  return {
    presets,
    plugins,
  }
}
