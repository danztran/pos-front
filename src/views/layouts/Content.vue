<template>
	<div class="dash-content">
		<transition name="move" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>

<style>
.dash-content {
  padding: 20px;
}
.md-layout.md-gutter > .md-layout-item {
	margin-top: 15px;
}
</style>

<script>
export default {};
</script>
