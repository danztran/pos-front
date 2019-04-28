<template>
	<transition
		name="move"
		mode="out-in"
	>
		<router-view />
	</transition>
</template>
<script>
export default {};
</script>
<style>
.move-enter-active,
.move-leave-active {
  transition: all 0.5s;
}

.move-enter,
.move-leave-to {
  opacity: 0;
  transform: rotateX(90deg);
}
</style>
