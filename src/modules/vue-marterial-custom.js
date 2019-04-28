import {
  MdButton,
  MdContent,
  MdField,
  MdProgress,
  MdTabs,
  MdCard,
  MdTable,
  MdRipple,
  MdEmptyState,
  MdRadio,
  MdSnackbar,
  MdTooltip,
  MdCheckbox,
  MdChips,
  MdSpeedDial,
  MdDialog
} from "vue-material/dist/components";

export default {
  install(Vue, options) {
    Vue.use(MdButton);
    Vue.use(MdContent);
    Vue.use(MdField);
    Vue.use(MdProgress);
    Vue.use(MdTabs);
    Vue.use(MdTable);
    Vue.use(MdCard);
    Vue.use(MdRipple);
    Vue.use(MdEmptyState);
    Vue.use(MdRadio);
    Vue.use(MdSnackbar);
    Vue.use(MdTooltip);
    Vue.use(MdCheckbox);
    Vue.use(MdChips);
    Vue.use(MdSpeedDial);
    Vue.use(MdDialog);
  }
};
