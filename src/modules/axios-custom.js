import axios from "axios";
import router from "@/router";
import cookies from "vue-cookies";

// insert all your axios logic here
axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			if (error.response.status === 401) {
				if	(cookies.get('user')) {
					cookies.set('_fm', 'Your session has expired.');
					cookies.remove('user');
				}
				router.push({ name: "login" });
			}
		} else {
			return Promise.reject({message: {'server': 'Server is not responding.'}});
		}

		return Promise.reject(error.response.data);
	}
);

export default axios;
