const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("@sumotto/beautify-html-webpack-plugin");
const miniSVGDataURI = require("mini-svg-data-uri");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");


// Variables
const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets"
}
const PAGES_DIR = `${PATHS.src}/views/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".pug"))


// Main config
module.exports = {
  mode: "production",
  devtool: false,
  output: {
    filename: "js/bundle.min.js",
    path: PATHS.dist,
    publicPath: "",
    clean: true
  },

  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        deleteOriginalAssets: false,
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },

          filter: (source) => {
            if (source.byteLength >= 8192) {
              return true;
            }
            return false;
          },

        },
        generator: [
          {
            type: "asset",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
  ]},

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: {
          pretty: true
        }
      },

      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ],
      },

      {
        test: /\.(png|jpeg|jpg|gif|svg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: 'images/[name][ext]'
        }
      },

      {
        test: /\.svg$/,
        type: "asset",
        generator: {
          dataUrl(content) {
            content = content.toString();
            return miniSVGDataURI(content);
          }
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]"
        }
      }
    ]
  },

  resolve: {
    alias: {
      "~": PATHS.src,
      "~modules": `${PATHS.src}/views/modules`,
    }
  },

  plugins: [

    new SVGSpritemapPlugin(`${PATHS.src}/images/sprites/*.svg`,
      {
        output: {
          filename: `/images/sprites.svg`,
          svg: {
            sizes: true
          }
        },
        sprite: {
          prefix: false,
          generate: {
            title: false,
            use: true,
            symbol: true,
          }
        },
        styles: {
          filename: `${PATHS.src}/styles/base/_sprites.scss`,
          variables: {
            sprites: "sprite",
            sizes: "size"
          },
        }
      }),

    new MiniCssExtractPlugin({
      filename: "css/[name].min.css"
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/static`, to: "" },
        {
          from: `${PATHS.src}/images`,
          to: "images",
          globOptions: {
            ignore: [
              "**/images/*.webp"
            ]
          }
        },
      ]
    }),

    // Automatic creation any html pages (Don"t forget to RERUN dev server)
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/, ".html")}`,
      inject: "body"
    })),
    new HtmlBeautifyPlugin({
      end_with_newline: true,
      indent_size: 2,
      indent_with_tabs: true,
      indent_inner_html: true,
      preserve_newlines: true,
      unformatted: ["p", "i", "b", "span"]
    }),

    // new WorkboxWebpackPlugin.InjectManifest({
    //   swSrc: "./src-sw.js",
    //   swDest: `${PATHS.dist}/sw.js`,
    //   exclude: [
    //     /\.map$/,
    //     /\.js$/,
    //     /\.mp3$/,
    //     /manifest$/,
    //     /\.htaccess$/,
    //     /service-worker\.js$/,
    //     /sw\.js$/,
    //   ],
    // }),
  ]
};
