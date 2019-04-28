import axios from "axios";
import router from "@/router";

// insert all your axios logic here
axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	response => {
		return response;
	},
	function(error) {
		if (error.response.status === 401) {
			router.push({ name: "login" });
		}
		return Promise.reject(error.response.data);
	}
);

export default axios;
