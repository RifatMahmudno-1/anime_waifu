<template>
	<section class="error">
		<Header />
		<Error />
		<Footer />
	</section>
</template>
<style scoped>
	.error {
		display: grid;
		min-height: 100vh;
		grid-template-rows: auto 1fr auto;
	}
</style>
