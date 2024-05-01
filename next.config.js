/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost', 'ucms-user-profile-images-dev.s3.ap-northeast-1.amazonaws.com', 'ucms-club-images-dev.s3.ap-northeast-1.amazonaws.com'],
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
				hostname: '',
			},
		],
	},
	env: {
		NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
	},
}

module.exports = nextConfig
