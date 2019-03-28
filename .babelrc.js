module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false, targets: ">1%, not op_mini all" }],
    "@babel/preset-react"
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-proposal-object-rest-spread"
  ],
  env: {
    commonjs: {
      plugins: [
        ["@babel/plugin-transform-modules-commonjs", { loose: true }]
      ],
    },
    rollup: {
      plugins: [
        "@babel/plugin-external-helpers"
      ]
    }
  }
}
