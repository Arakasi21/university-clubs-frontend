import useUserStore from '@/store/user'

export const FetchWithAuth = async (
	url: string,
	options: RequestInit = {},
	jwt_token: string,
): Promise<Response> => {
	const { setUser } = useUserStore()

	// Throw an error if jwt_token is not provided
	if (!jwt_token) {
		throw new Error('JWT token is missing')
	}

	// Add Authorization header
	options.headers = {
		...options.headers,
		Authorization: `Bearer ${jwt_token}`,
	}

	// Perform the fetch
	const response = await fetch(url, options)

	// If response status is 401 (Unauthorized), refresh token and retry
	if (response.status === 401) {
		options.credentials = 'include'
		const refreshRes = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`,
			options,
		)
		if (refreshRes.status === 200) {
			const data = await refreshRes.json()
			setUser(data.user, data.jwt_token)
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${data.jwt_token}`,
			}
			return await fetch(url, options)
		}
	}

	return response
}
