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
}

module.exports = nextConfig
