<template>
	<header>
		<router-link to="/"><h3>Anime Waifu</h3></router-link>
		<input type="search" v-model="query" @keypress="e => (e.keyCode == 13 ? search() : 'null')" placeholder="Type name to search" />
		<select ref="sel" @change="typeCng">
			<option value="q">Single</option>
			<option value="ani">Anime</option>
			<option value="man">Manga</option>
		</select>
		<button @click="search">Search</button>
	</header>
</template>

<script>
	export default {
		data() {
			return {
				query: '',
				type: this.$cookie.get('srchIn') || 'q'
			}
		},
		mounted() {
			this.$refs.sel.value = this.type
			let key = Object.keys(this.$route.query)[0]
			if (key) {
				this.$refs.sel.value = key
				this.typeCng()
			}
		},
		methods: {
			search() {
				if (this.query == '' || this.query.replace(/ /g, '') == '') return (this.query = '')
				this.$router.push(`/search?${this.type}=${encodeURIComponent(this.query)}`)
			},
			typeCng() {
				this.type = this.$refs.sel.value
				this.$cookie.set('srchIn', this.type)
				this.$emit('type', this.type)
			}
		}
	}
</script>

<style scoped>
	header {
		background: linear-gradient(-135deg, #c850c0, #4158d0);
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		padding: 0.2rem 0.5rem;
		align-items: center;
		gap: 0.5rem;
	}
	input,
	button,
	select {
		font-size: 90%;
	}
	button {
		padding: 0.1rem 1rem;
		transition: transform 0.2s;
	}
	input {
		max-width: 400px;
		padding: 0.1rem;
		width: 100%;
		justify-self: end;
		transition: transform 0.2s;
	}
	input:focus {
		transform: scale(1.05);
		transform-origin: right;
	}
	button:hover {
		transform: scale(1.05);
	}
	a {
		color: #fff;
		text-shadow: 0 0 5px aqua;
		transition: all 0.5s;
	}
	a:hover {
		color: aqua;
		text-shadow: 0 0 10px aqua;
		transform: scale(1.05);
	}
</style>
