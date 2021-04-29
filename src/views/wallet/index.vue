<template>
	<CRow>
		<CCol col="12">
			<CCard>
				<CCardHeader @click="item++">
					<div class="row d-flex justify-content-between">
						<div>
							<h3>My wallet</h3>
							<div>{{ account }}</div>
						</div>
						<div>
							<h3>$6,937.14</h3>
							<div class="float-right">Total value</div>
						</div>
					</div>
				</CCardHeader>
			</CCard>
		</CCol>
		<WalletList :items="items" :fields="fields" />
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
import poolListData from "../../mock/poolListDataPrivate";
import WalletList from "../../components/List/WalletList";
import confTokenTable from "../../components/Tables/confTokenTable";
export default {
	name: "Users",
	data() {
		return {
			items: poolListData,
			vettedTokenListData: vettedTokenList.tokens,
			darkModal: false,
			fields: [
				{
					key: "asset",
					label: "Asset",
					_classes: "font-weight-bold",
				},
				{ key: "tokens", label: "Holdings" },
			],
			activePage: 1,
			filterTokenData: [],
		};
	},
	components: {
		WalletList,
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
		account() {
			return this.$store.state.web3.userInfo !== {} &&
				this.$store.state.web3.userInfo.account
				? this.$store.state.web3.userInfo.account
				: "";
		},
		balances() {
			return this.$store.state.web3.balances !== {} &&
				this.$store.state.web3.balances
				? this.$store.state.web3.balances
				: "";
		},
	},
    mounted () {
        console.log(this.balances)
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
