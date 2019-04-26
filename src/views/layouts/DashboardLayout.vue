<template>
  <div>
    <navbar></navbar>
    <div class="dashboard-content">
      <dashboard-content></dashboard-content>
    </div>

    <notify></notify>
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

export default {
  components: {
    navbar: NavBar,
    "dashboard-content": Content,
    notify: Notify
  }
};
</script>
