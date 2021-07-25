<template>
	<main>
		<Header @type="e => (type = e)" />
		<div v-if="dtl" ref="dtl" class="dtl">
			<div class="img"><img :src="chars[view].img" /></div>
			<div class="des" v-html="chars[view].description.replace(/(<a([^>]+)>)/gi, '')"></div>
			<div class="ani">Data Provided by <a :href="chars[view].siteUrl">Anilist</a></div>
		</div>
		<loading v-if="!loaded" />
		<section v-else class="container" ref="container" @click="detail">
			<eachCard v-for="(char, ind) in chars" :key="ind" :char="char" :srch="true" />
		</section>
		<Footer />
	</main>
</template>
<script>
	export default {
		data() {
			return {
				type: this.$cookie.get('srchIn'),
				query: this.$route.query?.[Object.keys(this.$route.query)[0]] || '',
				chars: [],
				dtl: false,
				tOut: undefined,
				view: undefined,
				loaded: false
			}
		},
		methods: {
			getWaifu(type, name) {
				fetch('/api/search', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						encData: this.$crypt.enc(JSON.stringify({ type: type, name: name, email: this.$cookie.get('email') })),
						email: this.$cookie.get('email'),
						token: this.$cookie.get('token')
					})
				})
					.then(r => {
						if (r.status === 403) this.$emit('errMsg', 'Some errors have occured. Please try again.')
						if (r.status === 500) this.$emit('errMsg', 'Server Error Occured. Please try again')
						if (r.status === 401) this.$emit('errMsg', "You aren't logged in. Please login now.") && this.$router.push('/login')
						else return r.json()
					})
					.then(r => {
						this.loaded = true
						if (r.encData) this.chars = JSON.parse(this.$crypt.dec(r.encData))
						else this.chars = []
					})
					.catch(() => (this.chars = []))
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
					let add = path?.find(el => el.classList?.contains('add'))
					if (!ele) return false
					if (add) {
						let ind = Array.from(this.$refs.container.children).indexOf(ele)
						if (ind >= 0) this.addRemList(ind)
					} else {
						this.view = Array.from(this.$refs.container.children).indexOf(ele)
						if (this.chars[this.view].description == '') this.$emit('errMsg', 'No Description Provided')
						else this.dtl = true
					}
				}
			},
			addRemList(ind) {
				let stat = this.chars[ind].added == 'added' ? true : false
				delete this.chars[ind].added
				fetch('/api/editList', {
					method: stat ? 'DELETE' : 'PUT',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						encData: this.$crypt.enc(
							JSON.stringify({
								data: stat ? { id: this.chars[ind].id } : this.chars[ind],
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
						if (r.status == 'added') this.chars[ind].added = 'added'
						if (r.status == 'removed') this.chars[ind].added = 'notAdded'
					})
			},
			newData() {
				this.chars = []
				this.dtl = false
				this.tOut = undefined
				this.view = undefined
				this.loaded = false
				this.getWaifu(this.type, this.query)
			}
		},
		mounted() {
			this.getWaifu(this.type, this.query)
		},
		watch: {
			$route(to) {
				if (to.path != '/search') return false
				let key = Object.keys(to.query)[0]
				if (!key) return (this.query = '')
				this.query = to.query[key]
				this.newData()
			}
		}
	}
</script>
<style scoped>
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
	main {
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}
	section {
		background: linear-gradient(-180deg, #8f3088, #283888);
	}
	.container {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 12rem);
		padding: 6rem 4rem;
		grid-gap: 5rem;
		justify-content: center;
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
