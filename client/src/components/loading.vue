<template>
	<div class="loading" ref="loading" :style="'--min:' + size">
		<div class="center center1">
			<div class="ring"></div>
		</div>
		<div class="center center2">
			<div class="ring"></div>
		</div>
		<div class="lding">
			<span>{{ txt }}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Loading',
		data() {
			return {
				txt: 'Loading',
				size: '100vmin'
			}
		},
		methods: {
			txtAni() {
				let inc = true
				setInterval(() => {
					if (inc) {
						this.txt += '.'
						if (this.txt.length == 12) inc = false
					} else {
						this.txt = this.txt.slice(0, this.txt.length - 1)
						if (this.txt.length == 7) inc = true
					}
				}, 1000)
			},
			sizeCng() {
				let ele = this.$refs.loading
				new ResizeObserver(() => {
					let min = Math.min(ele.offsetHeight, ele.offsetWidth)
					this.size = `${min}px`
				}).observe(ele)
			}
		},
		mounted() {
			this.txtAni()
			this.sizeCng()
		}
	}
</script>

<style scoped>
	.loading {
		--min: 100vmin;
		background: linear-gradient(-45deg, #8a0a81, #0c1c6d);
		position: relative;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}
	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 8px solid #2a2929;
		border-radius: 50%;
	}

	.center1 {
		height: calc(var(--min) * 80 / 100);
		width: calc(var(--min) * 80 / 100);
		max-width: 350px;
		max-height: 350px;
		border-left-color: #ffc107;
		border-top-color: #ffc107;
		animation: animateCenter1 2s infinite linear;
	}

	.center2 {
		height: calc(var(--min) * 55 / 100);
		width: calc(var(--min) * 55 / 100);
		max-width: 220px;
		max-height: 220px;
		border-left-color: #2196f3;
		border-top-color: #2196f3;
		animation: animateCenter2 2s infinite linear;
	}

	.ring {
		position: absolute;
		top: 0;
		left: 50%;
		transform-origin: bottom;
		transform: translateX(-50%);
		width: 6px;
		height: 50%;
		background: transparent;
	}

	.center1 .ring {
		transform: translateX(-50%) rotate(45deg);
	}

	.center2 .ring {
		transform: translateX(-50%) rotate(-135deg);
	}

	.ring::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.center1 .ring::before {
		background: #ffc107;
		box-shadow: 0 0 0 10px rgba(255, 193, 7, 0.3), 0 0 10px 15px rgba(255, 193, 7, 0.5);
	}

	.center2 .ring::before {
		background: #2196f3;
		box-shadow: 0 0 0 10px rgba(33, 150, 243, 0.3), 0 0 10px 15px rgba(33, 150, 243, 0.5);
	}

	@keyframes animateCenter1 {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@keyframes animateCenter2 {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		100% {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
	}

	.lding {
		color: #fff;
		font-size: 1rem;
		height: 100%;
		width: 100%;
		position: absolute;
		display: grid;
		justify-content: center;
		align-content: center;
	}
</style>
