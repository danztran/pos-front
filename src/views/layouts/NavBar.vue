<template>
	<div class="navbar">
		<md-tabs class="md-primary" md-alignment="centered" md-sync-route>
			<!-- <md-tab v-if="user.sysAdmin" id="tab-home"
				md-label="Dashboard"
				md-icon="home"
				to="/dashboard" /> -->
			<md-tab id="tab-profile" :md-label="user.fullname"
				md-icon="account_circle"
				to="/profile" />
			<md-tab v-if="user.isAdmin" id="tab-users"
				md-label="Users"
				md-icon="supervisor_account"
				to="/users" />
			<md-tab id="tab-customers" md-label="Customers"
				md-icon="fiber_smart_record"
				to="/customers" />
			<md-tab id="tab-products" md-label="Products"
				md-icon="category"
				to="/products" />
			<md-tab id="tab-bills" md-label="Bills"
				md-icon="featured_play_list"
				to="/bills" />
			<md-tab id="tab-bill" md-label="Create Bill"
				md-icon="playlist_add"
				to="/bill-creator" />
			<md-tab v-if="user.sysAdmin" id="tab-activity-log"
				md-label="Activity Log"
				md-icon="assignment"
				to="/activity-logs" />
			<md-tab id="tab-logout" md-label="Log Out"
				md-icon="call_missed_outgoing"
				to="/logout" />
		</md-tabs>
	</div>
</template>
<style scoped>
.navbar {
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 2;
}
</style>
<script>
export default {
	name: 'TabIcons',
	data() {
		return {
			user: {
				fullname: '',
				username: ''
			}
		};
	},
	created() {
		this.user = this.$cookies.get('_us_r');
	},
	mounted() {
		this.$root.$on('selfEdit', (user) => {
			this.$cookies.set('_us_r', user);
			this.user = user;
		});
	}
};
</script>
