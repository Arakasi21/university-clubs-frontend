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
					setUser(refreshRes.data.user, refreshRes.data.jwt_token)
					error.config.headers['Authorization'] = `Bearer ${refreshRes.data.jwt_token}`
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
