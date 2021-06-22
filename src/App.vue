<template>
	<CRow
		style="width: 100%; height: 100%"
		v-if="loading"
	>
		<CCol
			col="12"
			style="margin-top: 20rem"
			class="d-flex flex-column justify-content-center align-items-center"
		>
			<CSpinner color="primary" style="width: 4rem; height: 4rem" />
			<h4 class="m-2">Executing, please do not quit.</h4>
		</CCol>
	</CRow>

	<router-view v-else> </router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: "App",
	computed: {
		loading() {
			return this.$store.state.web3.pageLoading;
		},
		isUpDate() {
			return this.$store.state.web3.isUpDate ? this.loadWeb3() : "";
		},
	},
	methods: {
		...mapActions(["init", "loadWeb3"]),
	},
	mounted() {
		console.log(this.init());
		this.init();
        this.loadWeb3()
	},
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "assets/scss/style";
</style>
