<template>
	<div>
		<div class="page-background" />
		<div class="page-content">
			<transition name="move" mode="out-in">
				<router-view />
			</transition>
		</div>
	</div>
</template>
<script>
export default {};
</script>
<style>

</style>
