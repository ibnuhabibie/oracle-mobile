
module.exports = function (api) {
  api.cache(false)

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        }
      ],
      ["@babel/plugin-transform-class-static-block"],
      'react-native-reanimated/plugin'
    ]
  }
};
