<template>
	<div class="Error_comp">
		<svg width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
				<path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#007FB2" stroke-width="6" sketch:type="MSShapeGroup"></path>
				<path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#EF4A5B" stroke-width="6" sketch:type="MSShapeGroup"></path>
				<path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#795D9C" stroke-width="6" sketch:type="MSShapeGroup"></path>
				<path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#F2773F" stroke-width="6" sketch:type="MSShapeGroup"></path>
				<path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#36B455" stroke-width="6" sketch:type="MSShapeGroup"></path>
			</g>
		</svg>
		<div class="message-box">
			<h1>404</h1>
			<p>Page not found</p>
			<div class="buttons-con">
				<a onclick="history.back(-1)" class="link-button link-back-button">Go Back</a>
				<router-link to="/" class="link-button">Go to Home Page</router-link>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'Error'
	}
</script>
<style scoped>
	.Error_comp {
		background: linear-gradient(135deg, #31008d, rgb(52, 0, 94), rgb(35, 0, 63));
		height: 100%;
		width: 100%;
		display: grid;
		justify-items: center;
		align-items: center;
		grid-template-columns: 1fr 1fr;
		padding: 3vmin;
	}

	svg {
		width: 100%;
		max-width: 380px;
		height: 100%;
		max-height: 500px;
	}

	.message-box {
		text-align: center;
	}

	.message-box > p {
		margin-bottom: 1rem;
	}

	.buttons-con {
		display: flex;
	}

	.buttons-con > * {
		cursor: pointer;
		background: #68c950;
		padding: 0.25rem 0.5rem;
		margin: 0 0.3rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 5px rgb(194, 194, 194);
		transition: 0.5s box-shadow, 0.5s background;
	}

	.buttons-con > *:hover {
		box-shadow: 0 5px 10px #fff;
		background: #41942c;
	}

	#Polygon-1,
	#Polygon-2,
	#Polygon-3,
	#Polygon-4,
	#Polygon-4,
	#Polygon-5 {
		animation: float 1s infinite ease-in-out alternate;
	}

	#Polygon-2 {
		animation-delay: 0.2s;
	}

	#Polygon-3 {
		animation-delay: 0.4s;
	}

	#Polygon-4 {
		animation-delay: 0.6s;
	}

	#Polygon-5 {
		animation-delay: 0.8s;
	}

	@keyframes float {
		100% {
			transform: translateY(20px);
		}
	}

	@media (max-width: 500px) {
		main {
			grid-template-columns: 1fr;
			align-content: center;
		}
	}
</style>
