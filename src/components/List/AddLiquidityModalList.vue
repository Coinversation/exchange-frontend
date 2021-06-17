<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					hover
					:items="tokens"
					:fields="fields"
					:items-per-page="15"
					clickable-rows
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="Asset" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								{{ item.symbol }}
							</div>
						</td>
					</template>
					<template slot="wallet" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								{{ 0 }}
								<CButton
									class="ml-3"
									color="info"
									variant="outline"
									square
									size="sm"
									@click="toggleDetails(item, index)"
								>
									Max
								</CButton>
							</div>
						</td>
					</template>
					<template slot="amount" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput type="number" name="" id="" />
							</div>
						</td>
					</template>
				</CDataTable>
			</CCardBody>
		</CCard>
		<CModal
			:show.sync="selectAssetModal"
			:no-close-on-backdrop="true"
			:centered="true"
			title="Settings"
			size="lg"
			color="dark"
		>
			<CCol xs="12" md="12">
				<CCard>
					<confTokenTable
						:vettedTokenListData="vettedTokenListData"
						:inputType="inputType"
						@filterData="filterData"
					></confTokenTable>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Settings</h6>
				<CButtonClose
					@click="selectAssetModal = false"
					class="text-white"
				/>
			</template>
			<template #footer>
				<div></div>
			</template>
		</CModal>
	</CCol>
</template>

<script>
import vettedTokenList from "../../config/vetted_tokenlist";
import confTokenTable from "../../components/Tables/confTokenTable";

export default {
	name: "ListPool",
	props: ["tokens", "fields"],
	data() {
		return {
			activePage: 1,
			vettedTokenListData: vettedTokenList.tokens,
			inputType: "",
			selectAssetModal: false,
			filterTokenDataA: "",
		};
	},
	components: {
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
		toggleDetails() {},
		filterData(s) {
			this.filterTokenDataA = s;
			this.selectAssetModal = false;
		},
		rowClicked(item) {
			console.log(item);
			this.$router.push({ path: `/explore-pools/${item.poolAddress}` });
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
