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
		},
		getYMDString(str) {
			const date = new Date(str);
			return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		},
		getLocaleDateTime(str) {
			const date = new Date(str);
			return this.getYMDString(str) + ', ' + date.toLocaleTimeString();
		}
	}
};
</script>