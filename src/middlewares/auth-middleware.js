import cookies from '@/modules/vue-cookies-custom';
import axios from '@/modules/axios-custom';
import router from '@/router';

const mdw = {

	guard(to, from, next) {
		if (!mdw.isUser()) {
			return router.push({ name: 'login' });
		}
		return next();
	},

	logout({ next, router }) {
		if (mdw.isUser()) {
			axios.get('/auth/logout')
				.then((res) => {
					const { message } = res.data;
					if (message) {
						cookies.set('_fm', "You have logged out");
					}
				})
				.catch((err) => {
					const { message } = err;
					switch (typeof message) {
						case 'object': cookies.set('_fm', Object.values(message).join('. ')); break;
						case 'string': cookies.set('_fm', message); break;
					}
				})
				.then(() => {
					cookies.remove('_us_r');
					next();
				});
		}
		else {
			return next();
		}
	},

	isUser() {
		return Boolean(cookies.get('_us_r'));
	}
};
export default mdw;
