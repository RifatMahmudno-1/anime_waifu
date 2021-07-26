<template>
	<main>
		<Header />
		<div v-if="dtl" ref="dtl" class="dtl">
			<div class="img"><img :src="chars[view].img" /></div>
			<imageUpload :char="chars[view]" @errMsg="(a, b) => $emit('errMsg', a, b || undefined)" />
			<div class="des" v-html="chars[view].description.replace(/(<a([^>]+)>)/gi, '')"></div>
			<div class="ani">Data Provided by <a :href="chars[view].siteUrl">Anilist</a></div>
		</div>
		<loading v-if="!loaded" />
		<section v-else @click="detail" class="container" ref="container">
			<eachCard v-for="(char, ind) in chars" :key="ind" :char="char" />
		</section>
		<Footer />
	</main>
</template>
<script>
	export default {
		data() {
			return {
				chars: [
					// { name: 'Rem', img: 'https://waifu-chan.netlify.app/img/rem.jpg', siteUrl: 'https://anilist.co/character/88575/Rem', birth: '02 February 86' }
				],
				error: false,
				dtl: false,
				tOut: undefined,
				loaded: false
			}
		},
		created() {
			this.mylist()
		},
		methods: {
			changeImg(e) {},
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
			}
		}
	}
</script>
<style scoped>
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
