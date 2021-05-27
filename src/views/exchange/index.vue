<template>
	<div
		class="c-app flex-row align-items-center"
		:class="{ 'c-dark-theme': $store.state.darkMode }"
	>
		<CContainer>
			<CRow class="justify-content-center">
				<CCol md="8">
					<CCard class="p-4">
						<CRow>
							<CCol class="d-flex justify-content-between">
								<h2>Swap</h2>
								<CButton
									color="light"
									shape="pill"
									@click="settingsModal = true"
								>
									<CIcon name="cil-cog"></CIcon>
								</CButton>
							</CCol>
						</CRow>
						<CCardBody>
							<CForm>
								<!-- valid-feedback="Input is valid." -->
								<!-- <div
									v-for="(item, index) in tokenExFilterList"
									:key="index"
								> -->
								<CInput
									placeholder="0"
									valid-feedback=""
									invalid-feedback=""
									value=""
									:is-valid="validator"
									size="lg"
									type="number"
									class="mb-3"
								>
									<template #prepend>
										<div
											style="width: 130px"
											class="d-flex align-items-center"
										>
											<img
												class="mr-2"
												:src="
													tokenExFilterList[0].logoURL
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
												tokenExFilterList[0].symbol !==
												""
													? tokenExFilterList[0]
															.symbol
													: "Select"
											}}
											<CButton
												color="light"
												variant="ghost"
												@click="
													selectAsset(
														tokenExFilterList[0]
													)
												"
											>
												<CIcon
													size="sm"
													name="cil-caret-bottom"
												/>
											</CButton>
										</div>
									</template>
								</CInput>
								<CCol
									class="d-flex justify-content-center align-items-center mb-3"
								>
									<CIcon
										class="mr-2"
										size="lg"
										name="cil-arrow-thick-to-bottom"
									/>
									<span>1 USDC = 0.290086 ETH</span>
								</CCol>

								<CInput
									placeholder="0"
									:valid-feedback="
										'Price impact: ' + priceImpact + '%'
									"
									invalid-feedback=""
									value=""
									:is-valid="validator"
									size="lg"
									type="number"
									class="mb-5"
									readonly
								>
									<template #prepend>
										<div
											style="width: 130px"
											class="d-flex align-items-center"
										>
											<img
												class="mr-2"
												:src="
													tokenExFilterList[1].logoURL
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
												tokenExFilterList[1].symbol !==
												""
													? tokenExFilterList[1]
															.symbol
													: "Select"
											}}
											<CButton
												color="light"
												variant="ghost"
												@click="
													selectAsset(
														tokenExFilterList[1]
													)
												"
											>
												<CIcon
													size="sm"
													name="cil-caret-bottom"
												/>
											</CButton>
										</div>
									</template>
								</CInput>
								<!-- </div> -->
								<CButton
									@click="enterAmount"
									color="primary"
									shape="pill"
									block
									size="lg"
								>
									Enter amount
								</CButton>
							</CForm>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
			<CModal
				:show.sync="settingsModal"
				:no-close-on-backdrop="true"
				:centered="true"
				title="Settings"
				size="lg"
				color="dark"
			>
				<CCol xs="12" md="12" lg="12">
					<CCard class="p-3">
						<CForm>
							<h5>Max slippage tolerance</h5>
							<CRow>
								<template v-for="item in options">
									<CButton
										:key="item"
										class="m-2"
										autocomplete="number"
										color="secondary"
										@click="checkTolerance(item)"
										>{{ item }}</CButton
									>
								</template>
								<CInput
									class="m-2"
									placeholder="10.0"
									:horizontal="{ input: 'col-6' }"
									type="number"
								/>
							</CRow>
							<h5 class="mt-4">Transaction history</h5>
							<CButton color="dark">clear</CButton>
							<h5 class="mt-4">Imported tokens</h5>
							<CButton color="dark">clear</CButton>
						</CForm>
					</CCard>
				</CCol>
				<template #header>
					<h6 class="modal-title">Settings</h6>
					<CButtonClose
						@click="settingsModal = false"
						class="text-white"
					/>
				</template>
				<template #footer>
					<div></div>
				</template>
			</CModal>
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
							:tokenFilterList="tokenExFilterList"
							:listData="listData"
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
		</CContainer>
	</div>
</template>

<script>
import vettedTokenList from "../../config/vetted_tokenlist";
import poolListData from "../../mock/poolListDataPrivate";
import confTokenTable from "../../components/Tables/confTokenTable";
import { getTokenBySymbol } from "@/lib/utils";

export default {
	name: "exchange",
	data() {
		return {
			priceImpact: "0.01",
			checked: false,
			vettedTokenListData: vettedTokenList.tokens,
			settingsModal: false,
			selectAssetModal: false,
			activePage: 1,
			selectOptions: [
				"1.0%",
				"Option 2",
				"Option 3",
				{
					value: "some value",
					label: "Selected option",
				},
			],
			selectedOption: "some value",
			options: ["0.5%", "1.0%", "2.0%", "5.0%"],
			radioNames: ["Inline Radios - custom"],
			filterTokenData: {},
			tokenExFilterList: [],
			listData: [],
		};
	},
	computed: {},
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
	created() {
		const dai = getTokenBySymbol("DAI");
		const usdc = getTokenBySymbol("USDC");
		dai.weights = 60;
		usdc.weights = 40;
		this.tokenExFilterList = [dai, usdc];
		this.$store.commit("TOKEN_EX_FILTER_LIST", this.tokenExFilterList);
		this.loading = false;
	},
	methods: {
		selectAsset(s) {
			this.filterTokenData = s;
			this.getListData();
			this.selectAssetModal = true;
		},
		getListData() {
			let vettedTokenListData = this.vettedTokenListData;
			let tokenExFilterList = this.tokenExFilterList;
			let set = tokenExFilterList.map((item) => item.symbol);
			let resArr = vettedTokenListData.filter(
				(item) => !set.includes(item.symbol)
			);

			this.listData = resArr;
		},
		filterData(s) {
			console.log(this.tokenExFilterList);
			this.tokenExFilterList.map((item, index) => {
				if (item.symbol === this.filterTokenData.symbol) {
					this.tokenExFilterList[index] = s;
					this.$store.commit(
						"TOKEN_FILTER_LIST",
						this.tokenExFilterList
					);
					return this.tokenExFilterList;
				}
			});
			this.filterTokenData = s;
			this.selectAssetModal = false;
		},
		checkTolerance(s) {
			console.log(s);
		},

		enterAmount() {},
		validator(val) {
			// return val ? val.length >= 1 : false;
			return val;
		},
	},
};
</script>
