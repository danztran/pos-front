export default {
	visible: {
		bind(el, binding) {
			el.classList.add('fade');
			if (binding.modifiers) {
				if (binding.modifiers.hid) {
					el.classList.add('fadeOut');
				}
			}
		},
		update(el, binding, vnode) {
			if (binding.value) {
				el.classList.add('fadeIn');
				el.classList.remove('fadeOut');
			}
			else {
				el.classList.add('fadeOut');
				el.classList.remove('fadeIn');
			}
		}
	}
};
