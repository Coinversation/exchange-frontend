<template>
	<CRow>
		<CCol col="12">
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

							<!-- <CNavItem
								:to="{
									path: '/explore-pools',
									query: { type: 'private' },
								}"
								>Private
							</CNavItem> -->
						</CNav>
					</div>
					<div class="col-6 d-flex justify-content-end">
						<CButton color="warning" @click="darkModal = true">
							Add token</CButton
						>
					</div>
				</div>
			</CCardBody>
		</CCol>
		<CCol col="12">
			<CCard>
				<CCardHeader @click="item++">
					<h4>Assets</h4>
				</CCardHeader>
				<CPoolList :items="items" />
			</CCard>
		</CCol>
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
					<DemoTable
						:vettedTokenListData="vettedTokenListData"
						@filterData="filterData"
					></DemoTable>
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
import CPoolList from "../../components/List/CPoolList";
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
			filterTokenData: [],
		};
	},
	components: {
		CPoolList,
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
		filterData(s) {
			this.filterTokenData.push(s);
			this.darkModal = false;
		},
		removeFilter(s) {
			Array.prototype.indexOf = function (val) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
				}
				return -1;
			};
			Array.prototype.remove = function (val) {
				var index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				}
			};
			this.filterTokenData.remove(s);
			console.log(this.filterTokenData);
		},
	},
};
</script>
