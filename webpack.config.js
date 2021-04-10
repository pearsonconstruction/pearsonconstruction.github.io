const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isProd = process.env.npm_lifecycle_event === 'build';

const imgsRegex = /\.(png|svg|jpg|jpeg|gif|webp)$/i;

module.exports = {
	entry: {
		'pearson-construction': [
			'./src/pearson-construction.js',
			'./src/pearson-construction.css',
		],
	},
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? undefined : 'source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: '',
		crossOriginLoading: 'anonymous',
	},
	optimization: {
		minimize: isProd,
		minimizer: [`...`, new CssMinimizerPlugin()],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			favicon: 'src/img/favicon.png',
		}),
		new CopyPlugin({
			patterns: [{ from: 'src/static', to: '.' }],
		}),
		new CspHtmlWebpackPlugin({
			'script-src': [
				`'sha256-zQg+Yh21X77A6mM86dXVdq89aYaNkHqnJoIbzTphee8='`,
				//`'sha256-ZVrYXAXe9e7vZeTnbvbWzwcSfH33g7W7epQfnLBXrWg='`,
				`https://pearsonconstruction.co.nz/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`
			],
			'worker-src': [`'self'`],
			'style-src': [`'self'`, 'https://fonts.googleapis.com'],
			'font-src': ['https://fonts.gstatic.com'],
		}),
		new SriPlugin({
			hashFuncNames: ['sha256', 'sha384'],
			enabled: process.env.NODE_ENV === 'production',
		}),
		isProd
			? new WorkboxPlugin.GenerateSW({
					clientsClaim: true,
					skipWaiting: true,
					exclude: [imgsRegex, /.*_config.yml$/i, /.*security.txt$/i],
					runtimeCaching: [
						{
							urlPattern: imgsRegex,
							handler: 'CacheFirst',
							options: {
								cacheName: 'images',
							},
						},
						{
							urlPattern: /.*cloudflare-static\/email-decode\.min\.js$/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'cloudflare',
							},
						},
					],
			  })
			: undefined,
		new WebpackPwaManifest({
			name: 'Pearson Construction',
			short_name: 'Pearson Construction',
			description:
				'Pearson Construction provides quality qualified building work in Wellington, New Zealand',
			theme_color: '#f2bb05',
			background_color: '#f2bb05',
			display: 'minimal-ui',
			scope: '/',
			start_url: '/',
			crossorigin: 'anonymous', //can be null, use-credentials or anonymous
			orientation: 'omit',
			lang: 'en-nz',
			ios: true,
			icons: [
				{
					src: path.resolve('src/img/pearson-construction-logo.png'),
					size: '534x360', // you can also use the specifications pattern
				},
			],
		}),
	].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
				],
			},
			{
				test: imgsRegex,
				type: 'asset/resource',
			},
		],
	},
};
