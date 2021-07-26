<template>
	<main>
		<form @submit.prevent="checkData">
			<img src="@/assets/login_img.webp" alt="An image" />
			<div class="inps">
				<label for="name" v-if="site == '/register'">Full Name:</label>
				<input id="name" v-if="site == '/register'" v-model="name" type="text" placeholder="Type your Fullname" required />
				<label for="email">Email:</label>
				<input id="email" v-model="email" type="email" placeholder="Type your Fullname" required />
				<label for="un_em">Password:</label>
				<input type="password" v-model="pass" placeholder="Type your password" required />
				<button type="submit">{{ site == '/login' ? 'Login' : 'Register' }}</button>
				<p v-if="site == '/login'">Don't have an account?? Click to register <router-link to="/register">Register</router-link></p>
				<p v-else>Already have an account?? Click to login <router-link to="/login">Login</router-link></p>
			</div>
		</form>
	</main>
</template>
<script>
	export default {
		data() {
			return {
				site: this.$route.path,
				name: '',
				email: '',
				pass: ''
			}
		},
		created() {
			let cookies = this.$cookie.all()
			if (cookies[0] == '') return false
			Object.keys(this.$cookie.all()).forEach(el => this.$cookie.del(el))
		},
		methods: {
			checkData() {
				fetch(`${this.$API}/api/log_reg`, {
					method: this.site == '/login' ? 'POST' : 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ encData: this.$crypt.enc(JSON.stringify({ name: this.name, email: this.email, pass: this.pass })) })
				})
					.then(r => {
						if (r.status == 500) this.$emit('errMsg', 'Server Error Occured. Please try again')
						else if (r.status == 403) this.$emit('errMsg', 'Please check the fields correctly.')
						else return r.json()
					})
					.then(r => {
						if (r.cookie) {
							Object.keys(r.cookie).forEach(key => {
								this.$cookie.set(key, r.cookie[key])
							})
						}
						if (r.status == 'logged') {
							this.$emit('errMsg', 'Login successful. Soon you will be redirected.', true)
							this.$router.push('/')
						} else if (r.status == 'registered') {
							this.$emit('errMsg', 'Register successful. Please login now.', true)
							this.$router.push('/login')
						} else if (r.status == 'duplicate') {
							this.$emit('errMsg', 'You already have an account. Please Login.')
							this.$router.push('/login')
						} else if (r.status == 'no_account') this.$emit('errMsg', "You don't have an account. Please register now.")
						else if (r.status == 'wrong_pass') this.$emit('errMsg', 'Incorrect password. Please try again or reset password.')
					})
					.catch(() => this.$emit('errMsg', 'Some errors have occured. Please try again.'))
			}
		},
		watch: {
			$route(to) {
				this.name = ''
				this.email = ''
				this.pass = ''
				this.site = to.path
			}
		},
		beforeEnter() {
			this.$cookie.del('token')
			this.$cookie.del('email')
		}
	}
</script>
<style scoped>
	main {
		background: linear-gradient(-135deg, #c850c0, #4158d0);
		min-height: 100vh;
		display: grid;
		align-items: center;
		justify-items: center;
	}
	form {
		background: #fff;
		color: #000;
		border-radius: 0.5rem;
		padding: 2rem 1rem;
		display: grid;
		grid-template-columns: 0.8fr 1.2fr;
		width: 100%;
		max-width: 800px;
		align-items: center;
		gap: 2rem;
	}
	img {
		width: 100%;
	}
	input {
		background: rgb(202, 202, 202);
		width: 100%;
		margin-bottom: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 1em;
		font-size: 90%;
		transition: transform 0.2s;
	}
	input:focus {
		transform: scale(1.03);
		box-shadow: 0 3px 5px hsla(0, 0%, 23%, 0.6);
	}
	button {
		padding: 0.2rem 1.5rem;
		transform: translateX(-50%);
		left: 50%;
		position: relative;
		background: linear-gradient(45deg, #c850c0, #4158d0, #4158d0, #c850c0);
		background-size: 200%;
		background-position: left;
		margin: 0.5rem 0;
		color: #fff;
		transition: background 0.2s;
		font-size: 1.5rem;
	}
	button:hover {
		background-position: right;
	}
	p {
		font-size: 90%;
		text-align: center;
	}
	a {
		display: inline-block;
		color: #ff00ee;
		text-decoration: none;
		text-shadow: 0 0 5px #c850c0;
		transition: all 0.2s;
	}
	a:hover {
		transform: scale(1.2);
		transform-origin: left;
	}
	label {
		margin-bottom: 0.1rem;
		padding-left: 0.5rem;
	}
</style>
