<template>
	<CHeader with-subheader>
		<CToggler
			in-header
			class="ml-3 d-lg-none"
			@click="$store.commit('toggleSidebarMobile')"
		/>
		<CToggler
			in-header
			class="ml-3 d-md-down-none"
			@click="$store.commit('toggleSidebarDesktop')"
		/>
		<CHeaderBrand class="mx-auto d-lg-none" to="/">
			<CIcon name="logo" height="48" alt="Logo" />
		</CHeaderBrand>
		<CHeaderNav class="d-md-down-none mr-auto">
			<!-- <CHeaderNavItem class="px-3">
				<CHeaderNavLink to="/dashboard"> Dashboard </CHeaderNavLink>
			</CHeaderNavItem>
			<CHeaderNavItem class="px-3">
				<CHeaderNavLink to="/users" exact> Users </CHeaderNavLink>
			</CHeaderNavItem>
			<CHeaderNavItem class="px-3">
				<CHeaderNavLink> Settings </CHeaderNavLink>
			</CHeaderNavItem> -->
		</CHeaderNav>
		<CHeaderNav>
			<!-- <CHeaderNavItem class="px-3 c-d-legacy-none">
				<button
					@click="() => $store.commit('toggle', 'darkMode')"
					class="c-header-nav-btn"
				>
					<CIcon v-if="$store.state.darkMode" name="cil-sun" />
					<CIcon v-else name="cil-moon" />
				</button>
			</CHeaderNavItem>
			<TheHeaderDropdownNotif />
			<TheHeaderDropdownTasks />
			<TheHeaderDropdownMssgs />
			<TheHeaderDropdownAccnt /> -->
			<CCol col="6" sm="4" md="2" xl class="mb-3 mb-xl-0">
				<CButton block color="primary" @click="darkModal = true"
					>Connect wallet</CButton
				>
			</CCol>
			<CHeaderNavItem class="px-3">
				<CButton
					block
					color="info"
					@click="accountModal = true"
					variant="outline"
					size="sm"
					><CIcon class="mr-2" size="lg" name="cil-smile" />
					<span style="width: 10px">{{
						"0x3f600a5FF59b7468577f3E6129AB9a519B7100B6".slice(
							0,
							10
						) + "..."
					}}</span></CButton
				>
				<!-- <button class="c-header-nav-btn">
						<CIcon size="lg" name="cil-wallet" class="mr-2" />
					</button> -->
			</CHeaderNavItem>
			<CHeaderNavItem class="px-3">
				<router-link :to="{ path: '/wallet' }">
					<button class="c-header-nav-btn">
						<CIcon size="lg" name="cil-wallet" class="mr-2" />
					</button>
				</router-link>
			</CHeaderNavItem>
			<!-- <CHeaderNavItem class="px-3">
				<button
					class="c-header-nav-btn"
					@click="$store.commit('toggle', 'asideShow')"
				>
					<CIcon
						size="lg"
						name="cil-applications-settings"
						class="mr-2"
					/>
				</button>
			</CHeaderNavItem> -->
		</CHeaderNav>

		<CSubheader class="px-3">
			<CBreadcrumbRouter class="border-0 mb-0" />
		</CSubheader>
		<CModal
			:show.sync="darkModal"
			:no-close-on-backdrop="true"
			:centered="true"
			title="Connect wallet"
			size="lg"
			color="dark"
		>
			<CCol xs="12" md="12">
				<CCard>
					<!-- <CCardHeader>
						<strong>Block Level CButtons </strong
						><small>Add this <code>block</code></small>
					</CCardHeader> -->
					<CCardBody>
						<!-- <CButton
							size="lg"
							variant="outline"
							color="secondary"
							block
							>Block level button</CButton
						> -->
						<CButton
							size="lg"
							variant="outline"
							color="primary"
							block
						>
							MetaMask
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="success"
							block
						>
							WalletConnect
						</CButton>
						<CButton size="lg" variant="outline" color="info" block>
							Portis
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="warning"
							block
						>
							Coinbase
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="danger"
							block
						>
							Fortmatic
						</CButton>
						<!-- <CButton size="lg" variant="ghost" color="info" block
							>Block level button</CButton
						> -->
					</CCardBody>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Connect wallet</h6>
				<CButtonClose @click="darkModal = false" class="text-white" />
			</template>
			<template #footer>
				<div></div>
				<!-- <CButton @click="darkModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="darkModal = false" color="success"
					>Accept</CButton
				> -->
			</template>
		</CModal>
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
					<!-- <CCardHeader>
						<strong>Block Level CButtons </strong
						><small>Add this <code>block</code></small>
					</CCardHeader> -->
					<CCardBody>
						<!-- <CButton
							size="lg"
							variant="outline"
							color="secondary"
							block
							>Block level button</CButton
						> -->
						<CButton
							size="lg"
							variant="outline"
							color="light"
							block
						>
							<CIcon class="mr-2" size="lg" name="cil-smile" />
							<span style="width: 10px">{{
								"0x3f600a5FF59b7468577f3E6129AB9a519B7100B6".slice(
									0,
									10
								) + "..."
							}}</span>
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="info"
							block
							@click="
								(darkModal = true) && (accountModal = false)
							"
						>
							Connect wallet
						</CButton>
						<CButton
							size="lg"
							variant="outline"
							color="danger"
							block
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
				<!-- <CButton @click="darkModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="darkModal = false" color="success"
					>Accept</CButton
				> -->
			</template>
		</CModal>
	</CHeader>
</template>

<script>
// import TheHeaderDropdownAccnt from "./TheHeaderDropdownAccnt";
// import TheHeaderDropdownNotif from "./TheHeaderDropdownNotif";
// import TheHeaderDropdownTasks from "./TheHeaderDropdownTasks";
// import TheHeaderDropdownMssgs from "./TheHeaderDropdownMssgs";

export default {
	name: "TheHeader",
	data() {
		return {
			darkModal: false,
			accountModal: false,
		};
	},
	components: {
		// TheHeaderDropdownAccnt,
		// TheHeaderDropdownNotif,
		// TheHeaderDropdownTasks,
		// TheHeaderDropdownMssgs,
	},
};
</script>
