<template>
	<CRow
		class="d-flex justify-content-center align-items-center"
		style="margin-top: 10%"
	>
		<CCol col="4">
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
						<CInput
							placeholder="Username"
							valid-feedback="Input is valid."
							invalid-feedback="Please provide at least 4 characters."
							value="Valid value"
							:is-valid="validator"
							:style="{ width: '200px', height: '200px' }"
						>
							<template #prepend>
								<CButton color="primary">
									<img
										style="
											width: 35px;
											height: 35px;
											border-radius: 35px;
											background-color: #d7d7d7;
										"
										alt=""
									/>
									BAI
									<CIcon size="sm" name="cil-caret-bottom" />
								</CButton>
							</template>
						</CInput>
						<CInput
							label="Input is invalid"
							valid-feedback="Thank you :)"
							invalid-feedback="Please provide at least 4 characters."
							:is-valid="validator"
						/>
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
					<DemoTable
						:vettedTokenListData="vettedTokenListData"
						@filterData="filterData"
					></DemoTable>
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
import DemoTable from "../../components/Tables/DemoTable";
export default {
	name: "Users",
	data() {
		return {
			checked: false,
			items: poolListData,
			vettedTokenListData: vettedTokenList.tokens,
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
			filterTokenData: [],
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
	components: {
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
		filterData(s) {
			this.filterTokenData.push(s);
			this.settingsModal = false;
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
		validator(val) {
			return val ? val.length >= 4 : false;
		},
	},
};
</script>
