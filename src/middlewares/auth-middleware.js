import cookies from "vue-cookies";

const mdw = {
	auth({ next, router }) {
		const auth = cookies.get("user");
		if (!auth) {
			return router.push({ name: "login" });
		}
		return next();
	},

	isUser() {
		return Boolean(cookies.get("user"));
	}
};
export default mdw;
