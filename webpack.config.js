const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.npm_lifecycle_event === 'build';

module.exports = {
    entry: {
        'pearson-construction': [
            './src/pearson-construction.js',
            './src/pearson-construction.css'
        ]
    },
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? undefined : 'source-map',
    devServer: {
        contentBase: './docs',
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[contenthash].js',
        publicPath: ''
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CspHtmlWebpackPlugin({
            'script-src': '',
            'style-src': ''
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],

    }
};
