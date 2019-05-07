<script>
export default {
	name: "HandleMessage",
	data() {
		flashMessage: ""
	},
	created() {
		let message = this.$cookies.get('_fm');
		if (message) {
			this.flashMessage = message;
			this.$cookies.remove('_fm');
		}
	},
	methods: {
		handleMessage(dataMsg) {
			if (typeof dataMsg == 'string') {
				this.$root.$emit("showMsg", dataMsg);
			}
			else {
				const messages = [];
				for (let key in dataMsg) {
					if (this.form) {
						if (this.form.hasOwnProperty(key)) {
							this.form[key].message = dataMsg[key];
						} else {
							messages.push(dataMsg[key]);
						}
					} else {
						messages.push(dataMsg[key]);
					}
				}

				if (messages.length > 0) {
					this.$root.$emit("showMsg", messages.join('\n\r'));
				} else {
					this.$root.$emit("hideMsg");
				}
			}
		}
	}
};
</script>