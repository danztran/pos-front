<template>
	<div class="centered-container">
		<div class="background" />
		<transition name="page" mode="out-in">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-content>
					<form @submit.prevent="sendAuth">
						<md-card-media>
							<img src="https://image.flaticon.com/icons/png/512/64/64526.png" alt="">
						</md-card-media>
						<md-card-header>
							<div class="md-title">
								Login to POS
							</div>
							<!-- <div class="md-subhead">Log in</div> -->
						</md-card-header>
						<md-card-content>
							<md-field :class="username.status">
								<label>Username</label>
								<md-input v-model="username.value" autofocus @keydown="username.status = ''" />
								<span class="md-error">{{ username.message }}</span>
							</md-field>
							<md-field md-has-password :class="password.status">
								<label>Password</label>
								<md-input
									v-model="password.value"
									type="password"
									@keydown="password.status = ''" />
								<span class="md-error">{{ password.message }}</span>
							</md-field>
						</md-card-content>
						<p class="text-message" v-visible="Boolean(flashMessage)">{{ flashMessage }}</p>
						<p class="text-message" v-visible="Boolean(message)">{{ message }}</p>
						<md-card-actions>
							<div class="actions md-layout md-alignment-center-space-between">
								<md-button type="submit" class="md-raised md-primary" @click="sendAuth">
									Log in
								</md-button>
							</div>
						</md-card-actions>
					</form>
				</md-content>
			</md-card>
		</transition>
	</div>
</template>
<script>
/* eslint-disable */

import { mixin as clickaway } from 'vue-clickaway';
import HandleMessage from '@/components/HandleMessage';
export default {
	name: "App",
	mixins: [HandleMessage],
	data: () => ({
		loading: false,
		username: {
			status: "",
			value: "",
			message: ""
		},
		password: {
			status: "",
			value: "",
			message: ""
		},
		message: "",
		flashMessage: "",
		errorClass: "md-invalid"
	}),
	methods: {
		clearMsg() {
			this.flashMessage = '';
			this.message = '';
		},
		sendAuth() {
			this.clearMsg();
			this.loading = true;
			this.$axios.post(this.$api.auth.login, {
					username: this.username.value,
					password: this.password.value
				})
				.then(res => {
					this.$cookies.set('user', res.data.user);
					this.$router.push({ name: 'dashboard' });
				})
				.catch(err => {
					let message = err.message;
					this.message = '';
					if (message) {
						for (let key in message) {
							if (this.hasOwnProperty(key)) {
								this[key].message = message[key];
								this[key].status = this.errorClass;
							} else {
								this.message += message[key];
							}
						}
					}
				})
			.then(() => {
				this.loading = false;
			});
		}
	}
};
</script>
<style lang="scss">
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

.centered-container {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 100vh;

	.md-card {
		top: -5vh;
		text-align: center;
		width: 100%;
		max-width: 370px;

		.md-content {
			margin: 20px;
		}

		img {
			max-width: 80px;
		}

		.text-message {
			text-align: left;
			color: firebrick;
			margin: 0;
			min-height: 20px;
			padding: 0 16px;
		}
	}
}
</style>