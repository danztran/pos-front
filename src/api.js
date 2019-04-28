const host = "http://localhost:8080";

const h = ref => host + ref;

export default {
	user: {
		add: h("/user/add"),
		edit: h("/user/edit"),
		query: h("/user/query")
	},
	customer: {
		add: h("/customer/add"),
		edit: h("/customer/edit"),
		query: h("/customer/query")
	}
};
