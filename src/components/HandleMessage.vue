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
		handleMessage(objectMsg) {
			if (objectMsg) {
				let message = "";
				for (let key in objectMsg) {
					if (this.form) {
						if (this.form.hasOwnProperty(key)) {
							this.form[key].message = objectMsg[key];
						} else {
							message += objectMsg[key];
						}
					} else {
						message += objectMsg[key];
					}
				}

				if (message.trim()) {
					this.$root.$emit("showMsg", message);
				} else {
					this.$root.$emit("hideMsg");
				}
			}
		}
	}
};
</script>