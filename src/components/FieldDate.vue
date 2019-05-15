<template>
	<div>
		<md-datepicker v-model="field.value"
			md-immediately
			:class="{'md-invalid': Boolean(field.message)}"
			:disabled="disabled"
			@md-opened="clearMsg">
			<label>{{ field.label }}</label>
			<span class="md-error">{{ field.message }}</span>
		</md-datepicker>
	</div>
</template>

<script>
export default {
	name: 'FieldInput',
	props: {
		field: {
			type: Object,
			default() {
				return {
					label: '',
					value: '',
					message: ''
				};
			}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		clearMsg() {
			this.field.message = '';
		}
	}
};
</script>
