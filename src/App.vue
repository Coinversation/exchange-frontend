<template>
	<!-- <CRow
		style="background-color: #6c6e7e; width: 100%; height: 100%;"
		v-if="!loading"
	>
		<CCol
			col="12"
			style="background-color: #6c6e7e; margin-top: 20rem"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<CSpinner color="primary" style="width: 4rem; height: 4rem" />
			<h4 class="m-2">Executing, please do not quit.</h4>
		</CCol>
	</CRow> -->

	<router-view> </router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: "App",
	computed: {
		loading() {
			return this.$store.state.web3.pageLoading;
		},
	},
	methods: {
		...mapActions(["init"]),
	},
	mounted() {
		this.init();
	},
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>
