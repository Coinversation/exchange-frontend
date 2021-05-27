<template>
	<div class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
		<!-- <TheSidebar/> -->
		<CWrapper>
			<TheHeaderEX />
			<div class="c-body">
				<main class="c-main">
					<CContainer fluid>
						<transition name="fade" mode="out-in">
							<router-view :key="$route.path"></router-view>
						</transition>
					</CContainer>
				</main>
			</div>
			<TheFooter />
		</CWrapper>
	</div>
</template>

<script>
import TheSidebar from "./TheSidebar";
import TheHeaderEX from "./TheHeaderEX";
import TheFooter from "./TheFooter";
import TheAside from "./TheAside";

export default {
	name: "TheContainer",
	components: {
		TheSidebar,
		TheHeaderEX,
		TheFooter,
	},
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
