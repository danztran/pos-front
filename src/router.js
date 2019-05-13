import Vue from "vue";
import Router from "vue-router";

import axios from "./modules/axios-custom";
import cookies from "vue-cookies";

import authMdw from "./middlewares/auth-middleware";

import Page from "./views/layouts/Page";
import Login from "./views/Login";
import DashboardLayout from "./views/layouts/DashboardLayout";
import Dashboard from "./views/Dashboard";
import UserManagement from "./views/UserManagement";
import CustomerManagement from "./views/CustomerManagement";
import ProductManagement from "./views/ProductManagement";
import BillManagement from "./views/BillManagement";
import BillCreator from "./views/BillCreator";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			component: Page,
			children: [
				{
					path: "/login",
					name: "login",
					component: Login,
					meta: {
						title: "Login",
						middleware: authMdw.logout
					}
				},
				{
					path: "/logout",
					name: "logout",
					redirect: "/login",
					meta: {
						title: "Logout"
					}
				},
				{
					path: "/",
					component: DashboardLayout,
					beforeEnter: authMdw.guard,
					redirect: "/dashboard",
					children: [
						{
							path: "dashboard",
							name: "dashboard",
							component: Dashboard,
							meta: {
								title: "Dashboard",
							}
						},
						{
							path: "users",
							name: "users",
							component: UserManagement,
							meta: {
								title: "User Management",
							}
						},
						{
							path: "customers",
							name: "customers",
							component: CustomerManagement,
							meta: {
								title: "Customer Management",
							}
						},
						{
							path: "products",
							name: "products",
							component: ProductManagement,
							meta: {
								title: "Product Management",
							}
						},
						{
							path: "bill-creator",
							name: "bill-creator",
							component: BillCreator,
							meta: {
								title: "Create Bill",
							}
						},
						{
							path: "bills",
							name: "bills",
							component: BillManagement,
							meta: {
								title: "Bill Management",
							}
						}
					]
				},
			]
		}
	]
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
	const subsequentMiddleware = middleware[index];
	// If no subsequent Middleware exists,
	// the default `next()` callback is returned.
	if (!subsequentMiddleware) return context.next;

	return (...parameters) => {
		// Run the default Vue Router `next()` callback first.
		context.next(...parameters);
		// Then run the subsequent Middleware with a new
		// `nextMiddleware()` callback.
		const nextMiddleware = nextFactory(context, middleware, index + 1);
		subsequentMiddleware({ ...context, next: nextMiddleware });
	};
}

router.beforeEach((to, from, next) => {
	if (to.meta.middleware) {
		const middleware = Array.isArray(to.meta.middleware)
			? to.meta.middleware
			: [to.meta.middleware];

		const context = {
			from,
			next,
			router,
			to
		};
		const nextMiddleware = nextFactory(context, middleware, 1);

		return middleware[0]({ ...context, next: nextMiddleware });
	}

	return next();
});

router.afterEach((to, from) => {
	// Vue.nextTick( () => {
	document.title = (to.meta.title || " ") +  " | POS Branch";
	// });
});

export default router;
