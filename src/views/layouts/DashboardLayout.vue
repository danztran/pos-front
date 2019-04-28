<template>
	<div>
		<navbar />
		<div class="dashboard-content">
			<dashboard-content />
		</div>

		<notify />
		<dial />
	</div>
</template>
<style lang="scss">
.dashboard-content {
  padding: 20px;
}
</style>
<script>
import NavBar from "./NavBar.vue";
import Content from "./Content.vue";
import Notify from "./Notify.vue";
import Dial from "./Dial.vue";

export default {
	components: {
		navbar: NavBar,
		"dashboard-content": Content,
		notify: Notify,
		dial: Dial
	}
};
</script>
