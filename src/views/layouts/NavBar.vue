<template>
  <div>
    <md-tabs class="md-primary" md-alignment="centered" md-sync-route>
      <md-tab
        id="tab-home"
        md-label="Dashboard"
        md-icon="home"
        to="/dashboard"
      ></md-tab>
      <md-tab
        id="tab-profile"
        :md-label="user.fullname"
        md-icon="account_circle"
        to="/profile"
      ></md-tab>
      <md-tab
        id="tab-users"
        md-label="Users"
        md-icon="supervisor_account"
        to="/users"
      ></md-tab>
      <md-tab
        id="tab-customers"
        md-label="Customers"
        md-icon="fiber_smart_record"
        to="/customers"
      ></md-tab>
      <md-tab
        id="tab-logout"
        md-label="Log Out"
        md-icon="call_missed_outgoing"
        to="/logout"
      ></md-tab>
    </md-tabs>
  </div>
</template>

<script>
export default {
  name: "TabIcons",
  data() {
    return {
      user: {
        fullname: "",
        username: ""
      }
    };
  },
  created() {
    this.user = this.$cookies.get("user");
  },
  mounted() {
    // this.$root.$on('updatedUserInfo', () => {
    //   //
    // });
  }
};
</script>

<style lang="scss" scoped></style>
