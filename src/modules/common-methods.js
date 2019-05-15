const _cm = {
	parseMoney(number) {
		return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	},
	notEmpty(arg) {
		switch (typeof arg) {
			case 'string': return arg !== '';
			case 'number': return true;
			case 'boolean': return true;
			case 'object': return arg === null ? false : Object.keys(arg).length > 0;
			case 'undefined': return false;
			default: return false;
		}
	},
	getDate(str) {
		const date = new Date(str);
		return date.toLocaleDateString('en-GB');
	},
	getDateTime(str) {
		const date = new Date(str);
		return date.toLocaleString('en-GB');
	},
	getTime(str) {
		const date = new Date(str);
		return date.toLocaleTimeString('en-GB');
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
			str = str.replace(`:${key}`, `<${obj[key]}>`);
		}
		return str;
	}
};

export default _cm;
