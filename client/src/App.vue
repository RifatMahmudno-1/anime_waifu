<template>
	<section class="main_con">
		<div v-if="errTxt.errShow" :class="'dis_err ' + errTxt.errAni" ref="dis_err">
			<div class="err" :style="errTxt.sty">{{ errTxt.con }}</div>
		</div>
		<router-view @errMsg="errMsg" />
	</section>
</template>
<script>
	let timeOut1
	export default {
		data() {
			return {
				errTxt: {
					con: 'jhgfjghf',
					sty: '',
					errShow: false,
					errAni: ''
				}
			}
		},
		methods: {
			errMsg(a, b) {
				if (b) this.errTxt.sty = 'border: 2px solid aqua; background: rgba(0, 255, 255, 0.6);'
				else this.errTxt.sty = 'border: 2px solid red; background: rgba(255, 0, 0, 0.6);'
				this.errTxt.errAni = ''
				setTimeout(() => {
					this.errTxt.errAni = 'err_ani'
				}, 10)
				this.errTxt.con = a
				this.errTxt.errShow = true
				clearTimeout(timeOut1)
				timeOut1 = setTimeout(() => {
					this.errTxt.errShow = false
				}, 5000)
			}
		}
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	body {
		font-size: 20px;
		font-family: 'Signika';
		color: #fff;
		user-select: none;
		overscroll-behavior-y: none;
	}
	input,
	button,
	textarea,
	select {
		font-family: inherit;
		outline: none;
		border: none;
		font-size: inherit;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
<style scoped>
	.dis_err {
		position: fixed;
		z-index: 9999;
		width: 100%;
		top: 4rem;
		transform: translateY(calc(-150% - 4rem));
	}
	.err_ani {
		animation: 5s errani linear forwards;
	}
	.err {
		font-size: 100%;
		width: fit-content;
		max-width: 70vw;
		word-wrap: break-word;
		margin: 0 auto;
		padding: 0.2rem 0.5rem;
		border-radius: 0.2rem;
	}

	@keyframes errani {
		5% {
			transform: translateY(0);
		}

		95% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(calc(-150% - 4rem));
		}
	}
</style>
