module.exports={
  entry: './src/index.js',
  module:{
    rules:[
      //babel loader -> JSX into JS
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        use: {
           loader: "babel-loader",
           options: {
             presets: ['@babel/preset-env', '@babel/preset-react']
           }
        }
      },
      //CSS style loader
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            }
          },
        ],
      },
    ]
  },
  stats:{
    errorDetails: true
  },
  plugins:[
  ]
}