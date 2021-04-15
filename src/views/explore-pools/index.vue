<template>
	<CRow>
		<CCol col="12">
			<!-- <CCard> -->
			<!-- <CCardHeader @click="item++">
					<CIcon name="cil-justify-center" />
					<strong> Bootstrap Navs </strong>
					<small>pill style</small>
				</CCardHeader> -->
			<CCardBody>
				<div class="row">
					<div class="col-6">
						<CNav variant="pills">
							<CNavItem
								active
								:to="{
									path: '/explore-pools',
									query: { type: 'shared' },
								}"
							>
								Shared
							</CNavItem>

							<CNavItem
								:to="{
									path: '/explore-pools',
									query: { type: 'private' },
								}"
								>Private
							</CNavItem>
						</CNav>
					</div>
					<div class="col-6 d-flex justify-content-end">
						<CButton
							color="primary"
							variant="outline"
							@click="darkModal = true"
						>
							<CIcon name="cil-list-filter" class="mr-2" />Filter
							by asset</CButton
						>
					</div>
				</div>
			</CCardBody>
			<!-- </CCard> -->
		</CCol>
		<Pool :items="items" />
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
					<DemoTable :vettedTokenListData="vettedTokenListData"></DemoTable>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Select token</h6>
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
	</CRow>
</template>

<script>
// import poolListData from "../../mock/poolListDataShared";
import vettedTokenList from "../../config/vetted_tokenlist";
import poolListData from "../../mock/poolListDataPrivate";
import Pool from "../../components/List/Pool";
import DemoTable from "../../components/Tables/DemoTable";
export default {
	name: "Users",
	data() {
		return {
			items: poolListData,
			vettedTokenListData: vettedTokenList.tokens,
			darkModal: false,
			fields: [
				{
					key: "poolAddress",
					label: "Pool address",
					_classes: "font-weight-bold",
				},
				{ key: "tokens", label: "Assets" },
				{ key: "swapFee", label: "Swap fee" },
				{ key: "marketCap", label: "Market cap" },
				{ key: "liquidity", label: "My liquidity" },
				{ key: "volume", label: "Volume (24h)" },
			],
			activePage: 1,
		};
	},
	components: {
		Pool,
		DemoTable,
	},
	watch: {
		$route: {
			immediate: true,
			handler(route) {
				if (route.query && route.query.page) {
					this.activePage = Number(route.query.page);
				}
			},
		},
	},
	methods: {
		getBadge(status) {
			switch (status) {
				case "Active":
					return "success";
				case "Inactive":
					return "secondary";
				case "Pending":
					return "warning";
				case "Banned":
					return "danger";
				default:
					"primary";
			}
		},
		rowClicked(item, index) {
			this.$router.push({ path: `users/${index + 1}` });
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
