<template>
	<footer>
		<div class="dev"><h4>This site is Developed by Rifat Mahmud- 2021</h4></div>
		<div class="icos">
			<span>Contact Me:</span>
			<a href="mailto:rifatmahmudpc@gmail.com" target="_blank"><img src="@/assets/email_ico.png" /></a>
		</div>
	</footer>
</template>

<style scoped>
	footer {
		background: linear-gradient(-135deg, #c850c0, #4158d0);
		display: grid;
		grid-template-columns: 1fr auto;
		text-align: center;
		padding: 0.2rem 0.5rem;
		align-items: center;
	}
	.icos img{
		height: 1.5em;
		vertical-align: top;
	}
	.icos span{
		vertical-align: bottom;
		margin-right: 0.5rem;
	}

</style>
