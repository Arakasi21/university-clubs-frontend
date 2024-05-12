import axios, { AxiosRequestConfig } from 'axios'
import useUserStore from '@/store/user'

// Create an axios instance
export const useAxiosInterceptor = () => {
	const { setUser, jwt_token } = useUserStore()
	const instance = axios.create()

	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response.status === 401) {
				const options: AxiosRequestConfig<any> = {
					method: 'POST',
					withCredentials: true,
					headers: {
						// prettier-ignore
						'Authorization': `Bearer ${jwt_token}`,
					},
				}
				const refreshRes = await instance(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
					options,
				)
				if (refreshRes.status === 200) {
					const data = refreshRes.data
					setUser(data.user, data.jwt_token)
					error.config.headers['Authorization'] = `Bearer ${data.jwt_token}`
					return instance(error.config)
				}
			}
			return Promise.reject(error)
		},
	)

	instance.interceptors.request.use(
		(config) => {
			// Add Authorization header to every request
			config.headers['Authorization'] = `Bearer ${jwt_token}`
			config.withCredentials = true
			return config
		},
		(error) => {
			return Promise.reject(error)
		},
	)

	return instance
}

export const FetchWithAuth = async (
	url: string,
	options: RequestInit = {},
	jwt_token: string | null,
	setUser: (user: any, jwt_token: string) => void,
): Promise<Response> => {
	// Throw an error if jwt_token is not provided
	if (!jwt_token) {
		throw new Error('JWT token is missing')
	}

	// Ensure options.headers is an instance of Headers or convert it if necessary
	if (!(options.headers instanceof Headers)) {
		options.headers = new Headers(options.headers)
	}

	// Add Authorization header
	options.headers.set('Authorization', `Bearer ${jwt_token}`)

	// Perform the fetch
	const response = await fetch(url, options)

	// If response status is 401 (Unauthorized), refresh token and retry
	if (response.status === 401) {
		options.credentials = 'include'
		options.method = 'POST'
		const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, options)
		if (refreshRes.status === 200) {
			const data = await refreshRes.json()

			setUser(data.user, data.jwt_token)
			options.headers.set('Authorization', `Bearer ${data.jwt_token}`)
			return await fetch(url, options)
		}
	}

	// Return the response if status is not 401 (Unauthorized)
	return response
}
