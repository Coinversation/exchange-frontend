<template>
	<CHeader with-subheader>
		<CHeaderBrand class="ml-3" to="/">
			<img
				class="mt-3 mb-3"
				style="width: 200px"
				src="../assets/images/logo.png"
				alt=""
			/>
		</CHeaderBrand>
		<CHeaderNav class="d-md-down-none mr-auto"> </CHeaderNav>
		<CHeaderNav>
			<CCol
				v-if="!injectedLoaded"
				col="6"
				sm="4"
				md="2"
				xl
				class="mb-3 mb-xl-0"
			>
				<CButton block color="primary" @click="connectWallet"
					>Connect wallet</CButton
				>
			</CCol>
			<CHeaderNavItem v-if="injectedLoaded" class="px-3">
				<CButton
					block
					color="info"
					@click="accountModal = true"
					variant="outline"
					size="md"
					style="width: 180px"
				>
					<div class="d-flex align-items-center">
						<Jazzicon
							:address="account"
							:diameter="24"
							shape-count="6"
							class="mt-1 mr-2"
						/>
						<span style="width: 10px">{{
							account ? account.slice(0, 10) + "..." : ""
						}}</span>
					</div>
				</CButton>
			</CHeaderNavItem>
			<CHeaderNavItem v-if="injectedLoaded" class="px-3">
				<router-link :to="{ path: '/wallet' }">
					<button class="c-header-nav-btn">
						<CIcon size="lg" name="cil-wallet" class="mr-2" />
					</button>
				</router-link>
			</CHeaderNavItem>
		</CHeaderNav>
		<CModal
			:show.sync="accountModal"
			:no-close-on-backdrop="true"
			:centered="true"
			title="Account"
			size="sm"
			color="dark"
		>
			<CCol xs="12" md="12">
				<CCard>
					<CCardBody>
						<CButton
							size="lg"
							variant="outline"
							color="light"
							block
						>
							<CIcon class="mr-2" size="lg" name="cil-smile" />
							<span style="width: 10px">{{
								account ? account.slice(0, 10) + "..." : ""
							}}</span>
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="danger"
							block
							@click="logOut"
						>
							Log out
						</CButton>
					</CCardBody>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Account</h6>
				<CButtonClose
					@click="accountModal = false"
					class="text-white"
				/>
			</template>
			<template #footer>
				<div></div>
			</template>
		</CModal>
	</CHeader>
</template>

<script>
import { mapActions } from "vuex";
import Jazzicon from "vue3-jazzicon/src/components";

export default {
	name: "TheHeader",
	data() {
		return {
			accountModal: false,
		};
	},
	components: {
		Jazzicon,
	},
	computed: {
		account() {
			return this.$store.state.web3.userInfo !== {} &&
				this.$store.state.web3.userInfo.account
				? this.$store.state.web3.userInfo.account
				: "";
		},
		injectedLoaded() {
			return this.$store.state.web3.userInfo !== {} &&
				this.$store.state.web3.userInfo.injectedLoaded
				? this.$store.state.web3.userInfo.injectedLoaded
				: false;
		},
	},
	methods: {
		...mapActions(["login", "logout"]),
		async connectWallet() {
			await this.login();
		},
		async logOut() {
			await this.logout();
			this.accountModal = false;
		},
	},
};
</script>
