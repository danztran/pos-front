<template>
	<div class="viewport" style="min-height: 290px;">
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
						<span>{{ _cm.parseMoney(product.salePrice) }}</span>
						<span v-if="product.sale">
							<span class="line-through">
								{{ _cm.parseMoney(product.price) }}
							</span>
							<span class="sale-pill">
								<span class="sale-pill_text"> -{{ product.sale }}% </span>
								<md-tooltip md-direction="top">
									{{ _cm.getDate(product.saleBegin) }}
									-
									{{ _cm.getDate(product.saleEnd) }}
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
						= {{ _cm.parseMoney(product.total) }}
					</div>

					<md-button class="md-icon-button md-list-action" @click="remove(product)">
						<md-icon>delete</md-icon>
					</md-button>
				</md-list-item>
				<md-divider />
			</div>
		</md-list>
	</div>
</template>
<script>
export default {
	name: 'BillProductList',
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
		}
	}
};
</script>
