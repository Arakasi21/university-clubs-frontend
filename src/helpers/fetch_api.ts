import axios, { AxiosRequestConfig } from 'axios'
import useUserStore from '@/store/user'

export const useAxiosInterceptor = () => {
	const { setUser, jwt_token } = useUserStore()
	const instance = axios.create()

	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response?.status === 401) {
				try {
					if (!jwt_token) {
						await new Promise((resolve) => setTimeout(resolve, 500))
						console.log(jwt_token)
					}
					const options: AxiosRequestConfig = {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${jwt_token}`,
						},
						withCredentials: true,
					}
					const refreshRes = await instance(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
						options,
					)
					if (refreshRes.status === 200) {
						setUser(refreshRes.data.user, refreshRes.data.jwt_token)
						error.config.headers['Authorization'] = `Bearer ${refreshRes.data.jwt_token}`
						return axios(error.config)
					} else {
						console.error('Refresh token request failed with status:', refreshRes.status)
					}
				} catch (refreshError) {
					console.error('Error refreshing token:', refreshError)
				}
			}
			console.error('Axios request failed:', error)
			return Promise.reject(error)
		},
	)

	instance.interceptors.request.use(
		(config) => {
			if (jwt_token) {
				config.headers['Authorization'] = `Bearer ${jwt_token}`
			}
			config.withCredentials = true
			return config
		},
		(error) => {
			return Promise.reject(error)
		},
	)

	return instance
}
