const components = [
	"MdButton",
	"MdContent",
	"MdField",
	"MdProgress",
	"MdTabs",
	"MdCard",
	"MdTable",
	"MdRipple",
	"MdEmptyState",
	"MdRadio",
	"MdSnackbar",
	"MdTooltip",
	"MdCheckbox",
	"MdChips",
	"MdSpeedDial",
	"MdDialog",
	"MdDatepicker",
	"MdMenu",
	"MdList",
	"MdAutocomplete",
	"MdSubheader",
	"MdDivider",
	"MdToolbar",
	"MdSwitch"
].map(e => require("vue-material/dist/components")[e]);

export default {
	install(Vue, options) {
		for (let cpn of components) {
			Vue.use(cpn);
		}
	}
};
