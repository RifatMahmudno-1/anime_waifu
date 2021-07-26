<template>
	<section>
		<input @change="addImg" ref="inpDD" type="file" style="display: none" accept="image/*" />
		<div @click="$refs.inpDD.click()" @dragover.prevent="scale = true" @dragleave.prevent="scale = false" :class="scale ? 'fileOver drag_drop' : 'drag_drop'" @drop.prevent="dropImg">
			<img src="@/assets/drag_drop.svg" />
			<div>{{ !imgSel ? 'Drag and Drop image or\nClick here to select image.' : file.name }}</div>
		</div>
		<div class="cngImg">
			<button v-if="imgSel && !uploading" @click="upImg">Change Image</button>
			<button v-if="imgSel && !uploading" @click="cancelUp">Cancel</button>
			<button disabled="true" v-if="imgSel && uploading">Uploading</button>
		</div>
	</section>
</template>
<script>
	export default {
		props: {
			char: { type: Object, required: true }
		},
		data() {
			return {
				imgSel: false,
				file: {},
				scale: false,
				oldImg: this.char.img,
				uploading: false
			}
		},
		methods: {
			addImg() {
				this.validUp(this.$refs.inpDD.files[0])
			},
			dropImg(e) {
				this.scale = false
				this.validUp(e.dataTransfer.files[0])
			},
			validUp(img) {
				if (!img) {
					this.$emit('errMsg', 'No image Selected')
					return false
				}
				if (img.size / 1000 > 2048) {
					this.$emit('errMsg', "File size mustn't exceed 2MB or 2048KB")
					return false
				}
				if (img.type.search('image/') < 0) {
					this.$emit('errMsg', 'File must be an image.')
					return false
				}
				this.file = img
				this.imgSel = true
				this.$refs.inpDD.value = null
				this.char.img = URL.createObjectURL(img)
			},
			cancelUp() {
				this.file = {}
				this.imgSel = false
				this.char.img = this.oldImg
			},
			upImg() {
				this.uploading = true
				let form = new FormData()
				form.append('img', this.file)
				form.append('email', this.$cookie.get('email'))
				form.append('token', this.$cookie.get('token'))
				form.append('id', this.char.id)
				fetch(`${this.$API}/api/imgUp`, {
					method: 'PUT',
					body: form
				})
					.then(r => {
						if (r.status === 403) {
							this.$emit('errMsg', 'Some errors have occured. Please try again.')
							this.cancelUp()
						}
						if (r.status === 500) {
							this.$emit('errMsg', 'Server Error Occured. Please try again')
							this.cancelUp()
						}
						if (r.status === r.status) {
							this.$emit('errMsg', "You aren't logged in. Please login now.")
							this.$router.push('/login')
						} else return r.json()
					})
					.then(r => {
						if (!r?.main) return false
						this.uploading = false
						this.imgSel = false
						this.char.img = r.main
						this.oldImg = this.char.img
					})
					.catch(() => {
						this.$emit('errMsg', 'Some errors have occured. Please try again.')
						this.cancelUp()
					})
			}
		}
	}
</script>
<style scoped>
	.cngImg {
		width: fit-content;
		margin: 0 auto;
		padding: 0.7rem 0;
	}

	button {
		width: fit-content;
		margin: 0 0.5rem;
		background: linear-gradient(45deg, pink, aqua);
		padding: 0.1rem 0.3rem;
	}

	.drag_drop {
		cursor: pointer;
		max-width: 400px;
		width: 100%;
		text-align: center;
		display: grid;
		grid-template-columns: auto auto;
		border: 2px dashed aqua;
		border-radius: 5px;
		justify-content: center;
		grid-column-gap: 0.5rem;
		align-items: center;
		margin: 0 auto;
		transition: transform 0.5s;
		white-space: pre;
	}

	.drag_drop > div {
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.drag_drop img {
		height: 3rem;
	}

	.fileOver {
		transform: scale(1.2);
		background: rgba(255, 255, 255, 0.4);
	}
</style>
