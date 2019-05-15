import cookies from '@/modules/vue-cookies-custom';
import axios from '@/modules/axios-custom';
import router from '@/router';

const mdw = {

	guard(to, from, next) {
		const auth = cookies.get('user');
		if (!auth) {
			return router.push({ name: 'login' });
		}
		return next();
	},

	logout({ next, router }) {
		if (mdw.isUser()) {
			axios.get('/auth/logout').then((res) => {
				cookies.remove('user');
			});
		}
		next();
	},

	isUser() {
		return Boolean(cookies.get('user'));
	}
};
export default mdw;
