<template>
	<div class="each" :srch="srch ? 'true' : 'false'">
		<img :src="char.img" draggable="false" />
		<div v-if="char.birth" class="birth">{{ formDate(char.birth) }}</div>
		<div class="add" v-if="srch && char.added">
			<span>{{ char.added == 'notAdded' ? 'Click to add' : 'Click to remove' }}</span>
			<img src="@/assets/heart_solid.svg" />
			<span class="cover"></span>
		</div>
		<div :srch="srch ? 'true' : 'false'" class="name">{{ char.name }}</div>
	</div>
</template>
<script>
	export default {
		props: { char: { type: Object, required: true }, srch: Boolean },
		methods: {
			formDate(date) {
				return date
					.split(' ')
					.map((el, ind) => {
						if (ind === 1) return el.slice(0, 3)
						else if (ind === 0) return el + '\n'
						else return ''
					})
					.join('')
			}
		}
	}
</script>
<style scoped>
	.cover {
		position: absolute;
		z-index: 2;
		height: 100%;
		width: 100%;
		cursor: pointer;
	}

	.each[srch='false']::before {
		counter-increment: each;
		content: counter(each);
		position: absolute;
		left: 1.5rem;
		font-size: 90%;
		clip-path: polygon(100% 0, 100% 60%, 50% 100%, 0 60%, 0 0);
		background: rgba(240, 2, 127, 0.6);
		height: 1.8rem;
		width: 2rem;
		text-align: center;
		padding-top: 0.25rem;
	}

	.each {
		position: relative;
		width: 100%;
		height: fit-content;
		aspect-ratio: 2/3;
		background: url('@/assets/loading.svg');
		background-position: center;
		background-repeat: no-repeat;
	}

	.each > img {
		vertical-align: top;
		width: 100%;
		height: 100%;
		border: 5px solid rgb(240, 2, 127);
		border-radius: 1rem;
		object-fit: cover;
		object-position: top;
	}

	.birth {
		position: absolute;
		width: fit-content;
		right: -2.2rem;
		top: 6rem;
		color: rgb(240, 2, 127);
		background: #fff;
		font-size: 50%;
		border-radius: 0.2rem;
		padding: 0.1rem 0.05rem;
		line-height: 1.5rem;
		text-align: center;
		line-height: 1.3rem;
		white-space: pre;
	}

	.birth::before {
		position: absolute;
		top: -2.3rem;
		right: 0;
		height: 1.3rem;
		width: 1.3rem;
		border-radius: 0.2rem;
		padding: 0.2rem;
		content: '';
		background: url('@/assets/cake.svg') no-repeat right center rgba(255, 255, 255, 0.4);
		background-origin: content-box;
	}

	.birth::first-line {
		font-size: 150%;
	}

	.name,
	.add {
		position: absolute;
		right: 1rem;
		color: #f0027f;
		background: #fff;
		font-size: 70%;
		padding: 0.1rem 0.5rem;
		border: 2px solid currentColor;
		border-radius: 0.4rem;
		text-decoration: none;
		box-shadow: 0 1px 5px pink;
		transition: box-shadow 0.2s;
		bottom: 1rem;
		width: fit-content;
		max-width: 10rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}
	.name[srch='true'] {
		bottom: 3rem;
	}
	.name:hover {
		box-shadow: 0 3px 10px rgb(255, 74, 216);
	}
	.name::before {
		content: '';
		background: url('@/assets/heart.svg') no-repeat right center rgba(255, 255, 255, 0.4);
		background-origin: content-box;
		height: 1em;
		width: 1em;
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.3rem;
	}
	.add {
		padding: 0;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
	}
	.add:hover {
		box-shadow: 0 3px 10px rgb(255, 74, 216);
	}
	.add span {
		padding: 0 0.5rem;
	}
	.add > img {
		height: 1.5rem;
		vertical-align: top;
		background: rgb(0, 255, 106);
		filter: invert(1);
		padding: 0.1rem;
	}
	@media only screen and (max-width: 1350px) {
		.birth {
			right: -1.8rem;
		}
	}
	@media only screen and (max-width: 1110px) {
		.name,
		.add {
			right: 0.5rem;
			max-width: 7rem;
		}
		.each > img {
			border: 3px solid rgb(240, 2, 127);
			border-radius: 0.7rem;
		}
	}
	@media only screen and (max-width: 800px) {
		.birth {
			top: 4rem;
			right: -1.5rem;
		}
		.birth::before {
			top: -1.8rem;
			height: 0.7rem;
			width: 0.7rem;
		}
		.name,
		.add {
			max-width: 6rem;
		}
	}
	@media only screen and (max-width: 490px) {
		.name,
		.add {
			max-width: 5rem;
		}
		.each[srch='false']::before {
			height: 1.3rem;
			width: 1.3rem;
		}
	}
	@media only screen and (max-width: 450px) {
		.name,
		.add {
			font-size: 50%;
			max-width: 4rem;
		}
	}
	@media only screen and (max-width: 390px) {
		.each > img {
			border: 2px solid rgb(240, 2, 127);
			border-radius: 0.5rem;
		}
		.birth {
			top: 2rem;
			right: -1.5rem;
		}
		.name,
		.add {
			font-size: 40%;
			max-width: 3rem;
		}
	}
</style>
