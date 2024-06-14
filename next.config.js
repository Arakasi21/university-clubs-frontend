/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5000',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5001',
			},
			{
				protocol: 'https',
				hostname: 'ucms-user-profile-images-dev.s3.ap-northeast-1.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'ucms-club-images-dev.s3.ap-northeast-1.amazonaws.com',
			},
		],
	},
	env: {
		NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
	},
	transpilePackages: ['@mdxeditor/editor'],
	reactStrictMode: true,
	webpack: (config) => {
		// this will override the experiments
		config.experiments = { ...config.experiments, topLevelAwait: true }
		// this will just update topLevelAwait property of config.experiments
		// config.experiments.topLevelAwait = true
		return config
	},
}

module.exports = nextConfig
