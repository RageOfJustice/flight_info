const path = require("path");
const webpack = require("webpack");
let NODE_ENV = process.env.NODE_ENV || "development";
NODE_ENV = "production";

function addHash(tmp, hashname) {
	return NODE_ENV === "production" ?
		tmp.replace(/\.[^.]+$/, `.[${hashname}]$&`) : `${tmp}?hash=[${hashname}]`;
}

module.exports = {
	context: path.join(__dirname, "/src/app"),
	entry: {
		bundle: "./index",
	},
	watch: NODE_ENV === "development",
	devtool: NODE_ENV === "development" ? "cheap-inline-module-source-map" : false,
	output: {
		filename: addHash("js/[name].js", "chunkhash"),
		path: NODE_ENV === "development" ? path.join(__dirname, "/src/assets") : path.join(__dirname, "/dist/assets"),
		publicPath: "/"
	},
	resolve: {
		modules: ["node_modules"],
		extensions: [".js", ".jsx", ".sass"]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		}),

	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				include: path.join(__dirname, "/src"),
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["es2015", "es2016", "react"]
				}
			},
			{
				test: /\.css$/,
				include: /flexboxgrid2/,
				use: [
					{loader: "style-loader"},
					{
						loader: "css-loader", options: {
							sourceMap: true
						}
					}]
			},
			{
				test: /\.(sass|scss)$/,
				include: path.join(__dirname, "/src"),
				use: [
					{loader: "style-loader"},
					{loader: "css-loader"}, {
						loader: "sass-loader",
						options: {
							sourceMap: true
						}
					}]
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				loaders: [
					{
						loader: "file-loader",
						options: {
							name: "[path][name].[ext]",
						}
					},
					{
						loader: "image-webpack-loader",
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: "65-90",
								speed: 4
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75
							}
						}
					}
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: "file-loader",
				options: {
					name: "[path][name].[ext]",
				}
			}
		]
	},
};

if (NODE_ENV === "production") {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				drop_console: true,
				unsafe: true
			}
		})
	);
}
