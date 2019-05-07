<script>
export default {
	name: "CommonMixin",
	methods: {
		parseMoney(number) {
			// number += '';
			return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
		},
		notEmpty(obj) {
			return Object.keys(obj).length > 0;
		}
	}
};
</script>