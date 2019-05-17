<template>
	<div class="form-bill">
		<h2>
			BILL - {{ process.env.VUE_APP_TITLE }} {{ bill.branchId }}
		</h2>
		<div class="info info-bill">
			<b>BILL</b>
			<p>ID: {{ bill._id }}</p>
			<p>Staff: {{ bill.user.fullname }}</p>
			<p>Date: {{ _cm.getDateTime(bill.createdAt) }}</p>
		</div>
		<div class="info info-customer">
			<b>CUSTOMER</b>
			<p>Name:  {{ bill.customer.fullname }}</p>
			<p>Phone: {{ bill.customer.phone }}</p>
		</div>
		<div>
			<table>
				<thead>
					<tr>
						<th>Index</th>
						<th>Product name</th>
						<th>Price</th>
						<th>Sale</th>
						<th>Quantity</th>
						<th>Subtotal</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(p, i) in bill.products" :key="p._id">
						<td>{{ i + 1 }}</td>
						<td>{{ p.product.name }}</td>
						<td>{{ _cm.parseMoney(p.price) }}</td>
						<td>
							<div v-if="p.sale">
								- {{ p.sale }}%
							</div>
						</td>
						<td>×{{ p.quantity }}</td>
						<td>{{ _cm.parseMoney(subtotal(p)) }}</td>
					</tr>
				</tbody>
				<tfoot>
					<tr v-if="bill.subpoint">
						<td />
						<td />
						<td><b>Point use:</b></td>
						<td>{{ bill.subpoint }}</td>
						<td>reduce: </td>
						<td>- {{ _cm.parseMoney(bill.subpoint) }}</td>
					</tr>
					<tr>
						<td />
						<td />
						<td />
						<td />
						<td>Total:</td>
						<td>{{ _cm.parseMoney(totalPrice()) }}</td>
					</tr>
				</tfoot>
			</table>
		</div>
		<div align="right">
			<b>Point bonus: </b> <span>+ {{ bill.bonus }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$bordercolor: #ddd;
.form-bill {
	h2 {
		margin-top: 0;
	}
	p {
		margin: 0;
		padding: 0;
	}
	.info {
		margin: 5px 0;
	}
	table {
		margin: 10px 0;
		border-collapse: collapse;
		td, th {
			text-align: left;
			border: 1px solid $bordercolor;
			padding: 8px;
			&:last-child {
				text-align: right;
			}
		}
		tfoot {
			td:nth-of-type(5) {
				font-weight: bold;
			}
		}
	}
}


</style>

<script>
export default {
	name: 'BillForm',
	props: {
		bill: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		subtotal(p) {
			return p.price * (100 - p.sale) / 100 * p.quantity;
		},
		totalPrice() {
			return this.bill.products.reduce((v, p) => v += this.subtotal(p), -parseFloat(this.bill.subpoint));
		}
	}
};
</script>
