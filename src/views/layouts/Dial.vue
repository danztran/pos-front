<template>
	<div>
		<md-speed-dial
			class="md-bottom-right"
			md-event="click"
		>
			<md-speed-dial-target class="md-primary">
				<md-icon class="md-morph-initial">
					add
				</md-icon>
				<md-icon class="md-morph-final">
					close
				</md-icon>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button
					class="md-accent"
					@click="userDialog = true"
				>
					new User
				</md-button>

				<md-button
					class="md-accent"
					@click="customerDialog = true"
				>
					new Customer
				</md-button>

				<md-button class="md-accent">
					new Product
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>

		<md-dialog :md-active.sync="userDialog">
			<user-form />
		</md-dialog>

		<md-dialog :md-active.sync="customerDialog">
			<customer-form />
		</md-dialog>
	</div>
</template>

<script>
import UserForm from "@/components/UserForm.vue";
import CustomerForm from "@/components/CustomerForm.vue";
export default {
	name: "Dials",
	components: {
		"user-form": UserForm,
		"customer-form": CustomerForm
	},
	data() {
		return {
			userDialog: false,
			customerDialog: false
		};
	}
};
</script>

<style lang="scss" scoped>
.md-speed-dial-content {
  align-items: flex-start;
}
.md-speed-dial-target {
  -webkit-box-shadow: 0 0 3px black;
  -moz-box-shadow: 0 0 3px black;
  box-shadow: 0 0 5px orange;
}
</style>
