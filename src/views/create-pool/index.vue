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
						<CButton
							color="warning"
							style="color: #ffffff"
							@click="darkModal = true"
						>
							Add token</CButton
						>
					</div>
				</div>
			</CCardBody>
		</CCol>
		<CCol col="12">
			<CCard>
				<CCardHeader>
					<h4>Assets</h4>
				</CCardHeader>
				<CPoolList :items="items" :fields="fields" />
				<CCardHeader>
					<h4>Swap fee (%)</h4>
					<CCol col="2">
						<CInput width="20px"></CInput>
					</CCol>
				</CCardHeader>
			</CCard>
			<CCol col="1">
				<CButton
					color="primary"
					style="color: #ffffff"
					@click="createPool"
                    size="lg"
				>
					Create</CButton
				>
			</CCol>
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
					<confTokenTable
						:vettedTokenListData="vettedTokenListData"
						@filterData="filterData"
					></confTokenTable>
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
// import poolListData from "../../mock/poolListDataPrivate";
import cPoolListData from "../../mock/cPoolListDataPrivate";
import CPoolList from "../../components/List/CPoolList";
import confTokenTable from "../../components/Tables/confTokenTable";
export default {
	name: "Users",
	data() {
		return {
			items: cPoolListData,
			vettedTokenListData: vettedTokenList.tokens,
			darkModal: false,
			fields: [
				{
					key: "assets",
					label: "Assets",
					_classes: "font-weight-bold",
				},
				{ key: "myBalance", label: "My balance" },
				{ key: "weights", label: "Weights" },
				{ key: "percent", label: "Percent" },
				{ key: "amount", label: "Amount" },
				{ key: "price", label: "Price" },
				{ key: "totalValue", label: "Total value" },
				{ key: "remove", label: "" },
			],
			activePage: 1,
			filterTokenData: [],
		};
	},
	components: {
		CPoolList,
		confTokenTable,
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
		createPool() {},
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
