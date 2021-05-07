<template>
	<CRow
		class="d-flex justify-content-center align-items-center"
		style="margin-top: 10%"
	>
		<CCol lg="4" md='6'>
			<CCard>
				<CCardHeader class="d-flex justify-content-between">
					<h4>Swap</h4>
					<CButton
						color="light"
						shape="pill"
						@click="settingsModal = true"
					>
						<CIcon name="cil-cog"></CIcon>
					</CButton>
				</CCardHeader>
				<CCardBody>
					<CForm>
						<!-- valid-feedback="Input is valid." -->

						<CInput
							placeholder="0"
							valid-feedback=""
							invalid-feedback="enter"
							value=""
							:is-valid="validator"
							size="lg"
							type="number"
							class="mb-3"
						>
							<template #prepend>
								<CButton color="light" @click="selectAsset(1)">
									<img v-if="filterTokenDataA !== ''"
										class="mr-2"
										:src="
											filterTokenDataA !== ''
												? filterTokenDataA.logoURL
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
										filterTokenDataA !== ""
											? filterTokenDataA.symbol
											: "Select"
									}}
									<CIcon size="sm" name="cil-caret-bottom" />
								</CButton>
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
								<CButton color="light" @click="selectAsset(2)">
									<img v-if="filterTokenDataB !== ''"
										class="mr-2"
										:src="
											filterTokenDataB !== ''
												? filterTokenDataB.logoURL
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
										filterTokenDataB !== ""
											? filterTokenDataB.symbol
											: "Select"
									}}
									<CIcon size="sm" name="cil-caret-bottom" />
								</CButton>
							</template>
						</CInput>
						<CButton
							@click="enterAmount"
							color="primary"
							shape="pill"
							block
							size="lg"
							:disabled="disabled"
						>
							Enter amount
						</CButton>
					</CForm>
				</CCardBody>
			</CCard>
		</CCol>
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
				<!-- <CButton @click="settingsModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="settingsModal = false" color="success"
					>Accept</CButton
				> -->
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
	</CRow>
</template>

<script>
// import poolListData from "../../mock/poolListDataShared";
import vettedTokenList from "../../config/vetted_tokenlist";
import poolListData from "../../mock/poolListDataPrivate";
import confTokenTable from "../../components/Tables/confTokenTable";
export default {
	name: "Users",
	data() {
		return {
			priceImpact: "0.01",
			checked: false,
			items: poolListData,
			vettedTokenListData: vettedTokenList.tokens,
			inputType: "",
			settingsModal: false,
			selectAssetModal: false,
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
			filterTokenDataA: "",
			filterTokenDataB: "",
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
		};
	},
	computed: {
		disabled() {
			console.log(this.filterTokenDataA.symbol);
			console.log(this.filterTokenDataB.symbol);
			return this.filterTokenDataA.symbol === this.filterTokenDataB.symbol
				? true
				: false;
		},
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
		checkTolerance(s) {
			console.log(s);
		},
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
		filterData(s, getType) {
			console.log(getType);
			switch (getType) {
				case 1:
					this.filterTokenDataA = s;
					break;
				case 2:
					this.filterTokenDataB = s;

					break;
			}
			this.selectAssetModal = false;
		},
		// removeFilter(s) {
		// 	Array.prototype.indexOf = function (val) {
		// 		for (var i = 0; i < this.length; i++) {
		// 			if (this[i] == val) return i;
		// 		}
		// 		return -1;
		// 	};
		// 	Array.prototype.remove = function (val) {
		// 		var index = this.indexOf(val);
		// 		if (index > -1) {
		// 			this.splice(index, 1);
		// 		}
		// 	};
		// 	this.filterTokenData.remove(s);
		// 	console.log(this.filterTokenData);
		// },
		enterAmount() {
			if (this.filterTokenDataA.symbol === this.filterTokenDataB.symbol) {
				return;
			} else {
				// this.disabled = true;
				return;
			}
		},
		validator(val) {
			return val ? val.length >= 1 : false;
		},
	},
};
</script>
