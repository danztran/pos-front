<template>
	<div>
		<md-field :class="{ 'md-invalid': field.message }" :md-counter="field.maxlength > 0">
			<label :for="field.name">
				{{ field.label }}
				<span v-if="tip1">
					<md-icon class="tooltip-icon"> help_outline </md-icon>
					<md-tooltip md-direction="top">{{ field.tooltip1 }}</md-tooltip>
				</span>
				<span v-if="tip2">
					<md-icon class="tooltip-icon"> help_outline </md-icon>
					<md-tooltip md-direction="top">{{ field.tooltip2 }}</md-tooltip>
				</span>
			</label>
			<span v-if="field.prefix" class="md-prefix">{{ field.prefix }}</span>
			<md-input
				:id="field.name"
				v-model="field.value"
				:type="field.type"
				:name="field.name"
				:disabled="disabled"
				:min="field.min != undefined ? field.min : null"
				:max="field.max > 0 ? field.max : null"
				:maxlength="field.maxlength > 0 ? field.maxlength : null"
				@input="field.message = ''" />
			<span v-if="field.suffix" class="md-suffix">{{ field.suffix }}</span>
			<span class="md-error">{{ field.message }}</span>
		</md-field>
	</div>
</template>

<style lang="scss" scoped>
.md-icon {
	&.tooltip-icon {
		font-size: 15px !important;
	}
}
</style>

<script>
export default {
	name: "FieldInput",
	props: {
		field: {
			type: Object,
			default() {
				return {
					label: "Label",
					name: "",
					type: "text",
					value: "",
					message: "",
					prefix: "",
					suffix: "",
					maxlength: null
				}
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		tip1: {
			type: Boolean,
			default: false
		},
		tip2: {
			type: Boolean,
			default: false
		}
	},
}
</script>