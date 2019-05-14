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
		},
		uniqBy(key = '', array = []) {
			for (let i = 0, len = array.length; i < len - 1; i++) {
				for (let j = i + 1; j < len; j++) {
					if (array[i][key] === array[j][key]) {
						array.splice(j, 1);
						len = array.length;
					}
				}
			}
			return array;
		},
		replaceVars(str, obj) {
			for (const key in obj) {
				str = str.replace(':' + key, obj[key]);
			}
			return str;
		}

	}
};
</script>