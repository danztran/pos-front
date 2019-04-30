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
	},
	product: {
		add: h("/product/add"),
		edit: h("/product/edit"),
		query: h("/product/query")
	}
};
