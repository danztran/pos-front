<template>
	<div>
		<md-speed-dial class="md-top-right md-fixed" md-event="click" md-direction="bottom">
			<md-speed-dial-target class="md-primary">
				<md-icon class="md-morph-initial">
					add
				</md-icon>
				<md-icon class="md-morph-final">
					close
				</md-icon>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button class="md-raised md-accent" to="/bill">
					new Bill
				</md-button>
				<md-button class="md-accent" @click="userDialog = true">
					new User
				</md-button>
				<md-button class="md-accent" @click="customerDialog = true">
					new Customer
				</md-button>
				<md-button class="md-accent" @click="showNewDialog('productDialog')">
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
.md-speed-dial {
	top: 36px !important;
	right: 70px !important;
	pointer-events: none;
	z-index: 2;
	.md-speed-dial-target {
		position: absolute;
		right: 0;
		pointer-events: all;
		// -webkit-box-shadow: 0 0 3px black;
		// -moz-box-shadow: 0 0 3px black;
		// box-shadow: 2px 0 3px grey;
	}
	.md-speed-dial-content {
		margin-top: 60px;
		align-items: flex-end;
		.md-button {
			// box-shadow: 0px 0px 2px 0px grey;
		}
	}
}
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
		"product-form": ProductForm,
	},
	data() {
		return {
			userDialog: false,
			customerDialog: false,
			productDialog: false,
			product: {},
		};
	},
	mounted() {
		this.$root.$on("productSelect", product => {
			this.product = product;
			this.productDialog = true;
		});
	},
	methods: {
		showNewDialog(dialog) {
			this[dialog] = true;
			this.product = {};
		}
	}
};
</script>
