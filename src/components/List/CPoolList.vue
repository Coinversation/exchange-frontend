<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					hover
					:items="tokens"
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
								<CButton
									color="light"
									@click="selectAsset(item)"
								>
									<img
										class="mr-2"
										:src="item.logoURL"
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
					<template slot="myBalance" slot-scope="{ item }">
						<td>{{ getBalance(item.address) }}</td>
					</template>
					<template slot="weights" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput type="number" value="" name="" id="" />
							</div>
						</td>
					</template>
                    <template slot="percent" slot-scope="{ item }">
						<td>{{ getBalance(item.address) }}</td>
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
                     <template slot="price" slot-scope="{ item }">
						<td>--</td>
					</template>
                     <template slot="totalValue" slot-scope="{ item }">
						<td>--</td>
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
import confTokenTable from "../../components/Tables/confTokenTable";
import { normalizeBalance } from "@/lib/utils";

export default {
	name: "ListPool",
	props: {
		tokens: { type: Array },
		fields: { type: Array },
	},
	data() {
		return {
			activePage: 1,
			inputType: "",
			selectAssetModal: false,
			filterTokenData: "",
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
	computed: {},
	mounted() {
		// console.log(this.tokens);
		// console.log(this.$store.state);
	},
	methods: {
		selectAsset(s) {
			this.filterTokenData = s;
			this.selectAssetModal = true;
		},
		filterData(s) {
			this.tokens.map((item, index) => {
				if (item.symbol === this.filterTokenData.symbol) {
					this.tokens[index] = s;
					// item = s;
					return this.tokens;
				}
			});
			this.filterTokenData = s;
			this.selectAssetModal = false;
		},
		getBalance(tokenAddress) {
            console.log(tokenAddress)
            console.log(174,this.$store.state.web3.tokenMetadata)
			const balance = normalizeBalance(
				this.$store.state.web3.balances[tokenAddress],
				this.$store.state.web3.tokenMetadata[tokenAddress].decimals
			);
			return parseFloat(balance).toFixed(3);
		},
		getPercentage(token) {
			return this.totalWeight == 0
				? 0
				: (this.weights[token] / this.totalWeight) * 100;
		},
		removeItem(item) {
			this.$set(this.usersData[item.id], "_toggled", !item._toggled);
			this.collapseDuration = 300;
			this.$nextTick(() => {
				this.collapseDuration = 0;
			});
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
