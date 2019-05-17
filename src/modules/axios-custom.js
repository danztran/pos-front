import axios from 'axios';
import router from '@/router';
import cookies from '@/modules/vue-cookies-custom';

// insert all your axios logic here
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	response => response,
	(error) => {
		if (error.response) {
			if (error.response.status === 401) {
				if	(cookies.get('_us_r')) {
					cookies.set('_fm', 'Your session has expired.');
					cookies.remove('_us_r');
				}
				router.push({ name: 'login' });
			}
		}
		else {
			return Promise.reject({ message: { server: 'Server is not responding.' } });
		}

		return Promise.reject(error.response.data);
	}
);

export default axios;
