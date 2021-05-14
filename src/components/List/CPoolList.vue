<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					:items="tokenFilterList"
					:fields="fields"
					:items-per-page="15"
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="assets" slot-scope="{ item }">
						<td>
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
							{{ item.symbol !== "" ? item.symbol : "Select" }}
							<CButton
								color="light"
								variant="ghost"
								@click="selectAsset(item)"
							>
								<CIcon size="sm" name="cil-caret-bottom" />
							</CButton>
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
						<td>{{ getPercentage(item.address) }}</td>
					</template>
					<template slot="amount" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput
									type="number"
									@input="handleAmountChange(item.address)"
									name=""
									id=""
								/>
							</div>
						</td>
					</template>
					<template slot="price" slot-scope="{ item }">
						<td>
							{{
								parseFloat(
									$store.state.price.values[item.address]
								).toFixed(2)
							}}
						</td>
					</template>
					<template slot="totalValue" slot-scope="{ item }">
						<td>
							{{ parseFloat(getValue(item.address)).toFixed(2) }}
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
						:inputType="inputType"
						:tokenFilterList="tokenFilterList"
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
import Vue from "vue";
// import { mapActions } from 'vuex';
import confTokenTable from "../../components/Tables/confTokenTable";
import { normalizeBalance, bnum } from "@/lib/utils";

export default {
	name: "ListPool",
	props: {
		fields: { type: Array },
	},
	data() {
		return {
			activePage: 1,
			inputType: "",
			selectAssetModal: false,
			filterTokenData: "",
			totalWeight: 0,
			amounts: {},
			weights: {},
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
	computed: {
		tokenFilterList() {
			return this.$store.state.tokenFilterList;
		},
	},
	mounted() {
		// console.log(this.tokenFilterList);
		// console.log(this.$store.state);
	},
	methods: {
		selectAsset(s) {
			this.filterTokenData = s;
			this.selectAssetModal = true;
		},
		filterData(s) {
			console.log(this.tokenFilterList);
			this.tokenFilterList.map((item, index) => {
				if (item.symbol === this.filterTokenData.symbol) {
					this.tokenFilterList[index] = s;
					this.$store.commit(
						"TOKEN_FILTER_LIST",
						this.tokenFilterList
					);
					return this.$store.commit(
						"TOKEN_FILTER_LIST",
						this.tokenFilterList
					);
				}
			});
			this.filterTokenData = s;
			this.selectAssetModal = false;
		},
		getBalance(tokenAddress) {
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
		handleWeightChange(tokenAddress) {
			this.handleAmountChange(tokenAddress);
		},
		handleAmountChange(tokenAddress) {
			const tokenPrice = this.$store.state.price.values[tokenAddress];
			if (!tokenPrice) {
				return;
			}
			const tokenValue = bnum(this.amounts[tokenAddress]).times(
				tokenPrice
			);
			const totalValue = tokenValue.div(this.weights[tokenAddress]);

			this.totalWeight = this.tokenFilterList.reduce((acc, token) => {
				const weight = parseFloat(this.weights[token]);
				return acc + weight;
			}, 0);

			for (const token of this.tokenFilterList) {
				if (token === tokenAddress || !this.padlock) {
					continue;
				}
				const tokenWeight = bnum(this.weights[token] || "");
				if (totalValue.isNaN() || tokenWeight.isNaN()) {
					Vue.set(this.amounts, token, "");
					continue;
				}
				const tokenPrice = this.price.values[token];
				if (!tokenPrice) {
					continue;
				}
				const tokenValue = tokenWeight.times(totalValue);
				const tokenAmount = tokenValue.div(tokenPrice);
				Vue.set(this.amounts, token, tokenAmount.toString());
			}
		},
		getValue(tokenAddress) {
			const tokenPrice = this.$store.state.price.values[tokenAddress];
			if (!tokenPrice || !this.amounts[tokenAddress]) {
				return 0;
			}
			return bnum(this.amounts[tokenAddress])
				.times(tokenPrice)
				.toFixed(2);
		},
		removeItem(s) {
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
			this.tokenFilterList.remove(s);
			this.$store.commit("TOKEN_FILTER_LIST", this.tokenFilterList);
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
