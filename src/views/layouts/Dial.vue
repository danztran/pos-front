<template>
	<div>
		<md-speed-dial
			class="md-bottom-right md-fixed"
			md-event="click">
			<md-speed-dial-target class="md-primary">
				<md-icon class="md-morph-initial">
					add
				</md-icon>
				<md-icon class="md-morph-final">
					close
				</md-icon>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button class="md-accent" @click="userDialog = true">
					new User
				</md-button>

				<md-button class="md-accent" @click="customerDialog = true">
					new Customer
				</md-button>

				<md-button class="md-accent" @click="showDialog('productDialog')">
					new Product
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>

		<md-dialog :md-active.sync="userDialog" class="user-dialog">
			<user-form />
		</md-dialog>

		<md-dialog :md-active.sync="customerDialog" class="customer-dialog">
			<customer-form />
		</md-dialog>

		<md-dialog :md-active.sync="productDialog" class="product-dialog">
			<md-dialog-content>
				<product-form :product="product" />
			</md-dialog-content>
		</md-dialog>
	</div>
</template>

<style lang="scss" scoped>
.md-dialog {
	.md-dialog-content {
		padding: 0 !important;
	}
	&.customer-dialog,
	&.user-dialog {
		width: 90%;
		max-width: 350px !important;
	}
	&.product-dialog {
		width: 90%;
		max-width: 600px !important;
	}
}
</style>

<script>
import UserForm from "@/components/UserForm";
import CustomerForm from "@/components/CustomerForm";
import ProductForm from "@/components/ProductForm";
export default {
	name: "Dials",
	components: {
		"user-form": UserForm,
		"customer-form": CustomerForm,
		"product-form": ProductForm
	},
	data() {
		return {
			userDialog: false,
			customerDialog: false,
			productDialog: false,
			product: {}
		};
	},
	mounted() {
		this.$root.$on("productSelect", (product) => {
			this.product = product;
			this.productDialog = true;
		});
	},
	methods: {
		showDialog(dialog) {
			this[dialog] = true;
			this.product = {};
		}
	}
};
</script>

<style lang="scss" scoped>
.md-speed-dial {
	z-index: 2;
}
.md-speed-dial-content {
  align-items: flex-start;
}
.md-speed-dial-target {
  // -webkit-box-shadow: 0 0 3px black;
  // -moz-box-shadow: 0 0 3px black;
  // box-shadow: 2px 0 3px grey;
}
</style>
