<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					hover
					:items="items"
					:fields="fields"
					:items-per-page="15"
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="assets" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CButton color="light" @click="selectAsset(1)">
									<img
										v-if="filterTokenDataA !== ''"
										class="mr-2"
										:src="
											filterTokenDataA !== ''
												? filterTokenDataA.logoURI
												: ''
										"
										style="
											width: 28px;
											height: 28px;
											border-radius: 35px;
											background-color: #d7d7d7;
										"
										alt=""
									/>
									{{
										item.symbol !== ""
											? item.symbol
											: "Select"
									}}
									<CIcon size="sm" name="cil-caret-bottom" />
								</CButton>
							</div>
						</td>
					</template>
					<template slot="weights" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput type="number" name="" id="" />
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
					<template #remove="{ item, index }">
						<td class="py-2">
							<CButton
								color="primary"
								variant="outline"
								square
								size="sm"
								@click="removeItem(item, index)"
							>
								Remove
							</CButton>
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
				<!-- <CButton @click="selectAssetModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="selectAssetModal = false" color="success"
					>Accept</CButton
				> -->
			</template>
		</CModal>
	</CCol>
</template>

<script>
import vettedTokenList from "../../config/vetted_tokenlist";
import confTokenTable from "../../components/Tables/confTokenTable";

export default {
	name: "ListPool",
	props: ["items", "fields"],
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
    mounted() {
        console.log(this.$store)
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
		selectAsset(s) {
			switch (s) {
				case 1:
					this.inputType = s;
					this.selectAssetModal = true;

					break;
				case 2:
					this.inputType = s;
					this.selectAssetModal = true;
					break;
			}
		},
		filterData(s) {
			this.filterTokenDataA = s;
			this.selectAssetModal = false;
		},
		removeItem(item) {
			this.$set(this.usersData[item.id], "_toggled", !item._toggled);
			this.collapseDuration = 300;
			this.$nextTick(() => {
				this.collapseDuration = 0;
			});
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
