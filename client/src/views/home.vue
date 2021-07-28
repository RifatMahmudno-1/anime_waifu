<template>
	<main>
		<Header />
		<div v-if="dtl" ref="dtl" class="dtl">
			<div class="img"><img :src="chars[view].img" /></div>
			<imageUpload :char="chars[view]" @errMsg="(a, b) => $emit('errMsg', a, b || undefined)" />
			<div class="rem" @click="remove(view)">Remove this character.</div>
			<div class="des" v-html="chars[view].description.replace(/(<a([^>]+)>)/gi, '')"></div>
			<div class="ani">Data Provided by <a :href="chars[view].siteUrl">Anilist</a></div>
		</div>
		<loading v-if="!loaded" />
		<section v-else @click="detail" class="container" ref="container">
			<eachCard v-for="(char, ind) in chars" :key="ind" :char="char" />
			<h3 v-if="chars.length == 0">You haven't added anyone.<br />Search by name or by anime or by manga and add to your list.</h3>
		</section>
		<Footer />
	</main>
</template>
<script>
	export default {
		data() {
			return {
				chars: [],
				error: false,
				dtl: false,
				tOut: undefined,
				loaded: false,
				view: undefined
			}
		},
		created() {
			this.mylist()
		},
		methods: {
			mylist() {
				this.loaded = false
				fetch(`${this.$API}/api/getlist`, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ email: this.$cookie.get('email'), token: this.$cookie.get('token') })
				})
					.then(r => {
						if (r.status === 401) this.$emit('errMsg', "You aren't logged in. Please login now.") && this.$router.push('/login')
						else if (r.status == 403) this.$emit('errMsg', 'Some errors have occured. Please Try agin.')
						else if (r.status == 500) this.$emit('errMsg', 'Some errors have occured in the server. Please try again.')
						else return r.json()
					})
					.then(r => {
						this.loaded = true
						if (!r.data) return false
						let data = JSON.parse(this.$crypt.dec(r.data))
						data.map(el => (el.newImg ? (el.img = el.newImg.main) : null))
						this.chars = data
					})
					.catch(() => this.$emit('errMsg', 'Some errors have occured. Please try again.'))
			},
			detail(e) {
				if (this.dtl && !this.tOut) {
					this.$refs.dtl?.classList.add('dtlOut')
					this.tOut = setTimeout(() => {
						this.dtl = false
						this.view = undefined
						this.tOut = undefined
					}, 500)
				} else if (!this.dtl && !this.tOut) {
					let path = e.path || e.composedPath()
					if (!path) return false
					let ele = path?.find(el => el.classList?.contains('each'))
					if (!ele) return false
					this.view = Array.from(this.$refs.container.children).indexOf(ele)
					if (this.chars[this.view].description == '') this.chars[this.view].description = 'No description provided...'
					this.dtl = true
				}
			},
			remove(ind) {
				if (confirm("This character will be removed from your list. It's modifications will also be removed.")) {
					fetch(`${this.$API}/api/editList`, {
						method: 'DELETE',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify({
							encData: this.$crypt.enc(
								JSON.stringify({
									data: { id: this.chars[ind].id },
									email: this.$cookie.get('email')
								})
							),
							email: this.$cookie.get('email'),
							token: this.$cookie.get('token')
						})
					})
						.then(r => {
							if (r.status === 401) this.$emit('errMsg', "You aren't logged in. Please login now.") && this.$router.push('/login')
							if (r.status === 403) this.$emit('errMsg', 'Some errors have occured. Please try again.')
							else if (r.status == 500) this.$emit('errMsg', 'Server error has occured. Please try again.')
							else return r.json()
						})
						.then(r => {
							if (r.status == 'removed') {
								this.dtl = false
								this.tOut = undefined
								this.chars.splice(ind, 1)
								this.view = undefined
							}
						})
						.catch(() => this.$emit('errMsg', 'Some errors have occured. Please try again.'))
				}
			}
		}
	}
</script>
<style scoped>
	.rem {
		margin: 0 auto 1rem auto;
		text-align: center;
		width: fit-content;
		padding: 0.3rem 0.5rem;
		background: rgba(255, 143, 143, 0.2);
		border: 2px solid red;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: box-shadow 0.2s;
	}
	.rem:hover {
		box-shadow: 0 2px 5px red;
	}
	.rem::before {
		content: '';
		background: url('@/assets/close.svg') no-repeat right center;
		background-origin: content-box;
		height: 1em;
		width: 1em;
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.3rem;
		transform: scale(1.2);
	}
	.container h3 {
		grid-column: 1/-1;
		border: 4px dotted aqua;
		height: fit-content;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 0.5rem;
		backdrop-filter: blur(10px);
		text-align: center;
	}
	main {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}
	.container {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 12rem);
		padding: 6rem 4rem;
		grid-gap: 5rem;
		justify-content: center;
		counter-reset: each;
		background-image: linear-gradient(rgba(240, 2, 127, 0.6), rgba(240, 2, 127, 0.6)), url('https://waifu-chan.netlify.app/img/wallpaper.jpg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed;
	}
	.dtl {
		position: fixed;
		width: 80vmin;
		max-width: 600px;
		aspect-ratio: 1/1;
		background: rgba(101, 38, 138, 0.9);
		transform: translate(calc((100vw - 100%) / 2), -100vh);
		z-index: 99;
		animation: dtlDown 0.5s ease forwards;
		overflow-y: auto;
		border: 2px solid aqua;
		border-radius: 0.5rem;
		padding: 0.5rem;
	}
	.dtl .img {
		display: grid;
		justify-items: center;
		padding: 1rem;
		width: 80%;
		max-width: 200px;
		margin: 0 auto;
	}
	.dtl .img img {
		width: 100%;
		aspect-ratio: 2/3;
		background-image: url('@/assets/loading.svg');
		background-position: center;
		background-repeat: no-repeat;
	}
	.dtl .des {
		background: rgba(255, 255, 255, 0.2);
		color: azure;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
	.dtl .ani {
		text-align: center;
		margin-top: 0.5rem;
	}
	.dtl .ani > a {
		color: orange;
		text-shadow: 0 0 5px;
	}
	.dtl > div > img {
		width: 100%;
		border: 2px solid aqua;
		border-radius: 1rem;
		object-fit: cover;
		object-position: center;
	}
	.dtlOut {
		animation: dtlUp 0.5s ease forwards;
	}
	@keyframes dtlDown {
		0% {
			transform: translate(calc((100vw - 100%) / 2), -100vh);
		}
		100% {
			transform: translate(calc((100vw - 100%) / 2), calc((100vh - 100%) / 2));
		}
	}
	@keyframes dtlUp {
		0% {
			transform: translate(calc((100vw - 100%) / 2), calc((100vh - 100%) / 2));
		}
		100% {
			transform: translate(calc((100vw - 100%) / 2), -100vh);
		}
	}
</style>
