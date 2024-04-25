/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['localhost'],
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
