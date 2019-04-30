import Vue from "vue";
import Router from "vue-router";

import axios from "./modules/axios-custom";
import cookies from "vue-cookies";

import authMdw from "./middlewares/auth-middleware";

import Login from "./views/Login.vue";
import DashboardLayout from "./views/layouts/DashboardLayout.vue";
import Dashboard from "./views/Dashboard.vue";
import UserManagement from "./views/UserManagement.vue";
import CustomerManagement from "./views/CustomerManagement.vue";
import ProductManagement from "./views/ProductManagement.vue";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/login",
			name: "login",
			component: Login,
			meta: {
				title: "Login",
				middleware: function({ next, router }) {
					if (authMdw.isUser()) {
						axios.get("/auth/logout").then(res => {
							cookies.remove("user");
						});
					}
					next();
				}
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
			redirect: "/dashboard",
			children: [
				{
					path: "dashboard",
					name: "dashboard",
					component: Dashboard,
					meta: {
						title: "Dashboard",
						middleware: authMdw.auth
					}
				},
				{
					path: "users",
					name: "users",
					component: UserManagement,
					meta: {
						title: "User Management",
						middleware: authMdw.auth
					}
				},
				{
					path: "customers",
					name: "customers",
					component: CustomerManagement,
					meta: {
						title: "Customer Management",
						middleware: authMdw.auth
					}
				},
				{
					path: "products",
					name: "products",
					component: ProductManagement,
					meta: {
						title: "Product Management",
						middleware: authMdw.auth
					}
				}
			]
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
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
