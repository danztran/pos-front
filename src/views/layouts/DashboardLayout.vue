<template>
	<div>
		<navbar />
		<dash-content />
		<notify />
		<dial />
	</div>
</template>

<script>
import NavBar from './NavBar.vue';
import Content from './Content.vue';
import Notify from './Notify.vue';
import Dial from './Dial.vue';

export default {
	components: {
		navbar: NavBar,
		'dash-content': Content,
		notify: Notify,
		dial: Dial
	}
};
</script>
