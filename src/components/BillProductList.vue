<template>
	<div class="viewport">
		<md-card>
			<md-card-content>
				<md-toolbar :md-elevation="1">
					<span />
					<span class="md-title">List: </span>
					<span v-if="products.length < 1" class="md-title">{{ products.length }} product </span>
					<span v-else class="md-title">{{ products.length }} products </span>
				</md-toolbar>

				<md-list is="transition-group" class="md-double-line" name="height" mode="out-in">
					<div v-for="product of products" :key="product.code">
						<md-list-item class="md-layout">
							<div class="md-list-item-text md-layout-item md-large-size-30">
								<span>{{ product.name }}</span>
								<span>{{ product.code }}</span>
							</div>
							<div class="md-list-item-text">
								<span>{{ parseMoney(product.salePrice) }}</span>
								<span v-if="product.sale">
									<span class="line-through">
										{{ parseMoney(product.price) }}
									</span>
									<span class="sale-pill">
										<span class="sale-pill_text"> -{{ product.sale }}% </span>
										<md-tooltip md-direction="bottom">
											{{ getYMDString(product.saleBegin) }}
											-
											{{ getYMDString(product.saleEnd) }}
										</md-tooltip>
									</span>
								</span>
							</div>
							<div class="md-list-item-text">
								<span style="max-width: 70px;">
									<md-field>
										<label>Quantity</label>
										<md-input v-model.number="product.buyQuantity" min="1"
											:max="product.quantity"
											type="Number"
											@change="updatePrice(product)" />
									</md-field>
									<span>/{{ product.quantity }}</span>
								</span>
							</div>
							<div class="md-list-item-text">
								= {{ parseMoney(product.total) }}
							</div>

							<md-button class="md-icon-button md-list-action" @click="remove(product)">
								<md-icon>delete</md-icon>
							</md-button>
						</md-list-item>
						<md-divider />
					</div>
				</md-list>
			</md-card-content>
		</md-card>
	</div>
</template>
<style>
/*input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}*/
</style>
<script>
import CommonMixin from "@/components/CommonMixin";
export default {
	name: "BillProductList",
	mixins: [CommonMixin],
	props: {
		products: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		sync(data) {
			this.$emit('update:products', data || [...this.products]);
		},
		remove(item) {
			this.sync(this.products.filter(e => e.code !== item.code));
		},
		updatePrice(product) {
			product.total = product.salePrice * product.buyQuantity;
			this.sync();
		},
	}
}
</script>