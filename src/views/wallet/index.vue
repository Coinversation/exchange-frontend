<template>
	<CRow>
		<CCol col="12">
			<CCard>
				<CCardHeader @click="item++">
					<div class="row d-flex justify-content-between m-2">
						<div>
							<h3>My wallet</h3>
							<div>{{ account }}</div>
						</div>
						<div>
							<h3>${{ balancesTotalValue }}</h3>
							<div class="float-right">Total value</div>
						</div>
					</div>
				</CCardHeader>
			</CCard>
		</CCol>
		<WalletList :items="balances" :fields="fields" />
	</CRow>
</template>

<script>
import vettedTokenList from "../../config/vetted_tokenlist";
import WalletList from "../../components/List/WalletList";
export default {
	name: "Users",
	data() {
		return {
			vettedTokenListData: vettedTokenList.tokens,
			darkModal: false,
			fields: [
				{
					key: "address",
					label: "Asset",
					_classes: "font-weight-bold",
				},
				{ key: "price", label: "Holdings" },
			],
			activePage: 1,
			filterTokenData: [],
		};
	},
	components: {
		WalletList,
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
			// console.log(
			// 	JSON.parse(JSON.stringify(this.$store.state.web3.balances))
			// );
			// console.log(this.$store.state.web3.tokenMetadata);
			const balances = Object.entries(this.$store.state.web3.balances)
				.filter(
					([address]) =>
						address !== this.$store.state.web3.tokenSymbol &&
						this.$store.state.web3.tokenMetadata[address]
				)
				.map(([address, denormBalance]) => {
					console.log(76, denormBalance);

					const price = this.$store.state.price.values[address];
					const spstr = denormBalance.split("");

					this.$store.state.price.si.filter((item) => {
						if (item.value === spstr[spstr.length - 1]) {
							console.log(83, item.power);
							console.log(
								84,
								denormBalance.substring(
									0,
									denormBalance.length - 1
								)
							);
							console.log(91, Math.pow(10, item.power));
							denormBalance =
								denormBalance.substring(
									0,
									denormBalance.length - 1
								) * Math.pow(10, item.power);
							console.log(90, denormBalance);
							return denormBalance;
						}
					});

					// const balance =
					// 	denormBalance /
					// 	this.$store.state.web3.tokenMetadata[address].decimals;
					const balance = denormBalance;
					console.log(balance);
					return {
						address,
						name: this.$store.state.web3.tokenMetadata[address]
							.name,
						symbol: this.$store.state.web3.tokenMetadata[address]
							.symbol,
						price,
						balance,
						value: balance * price,
					};
				})
				.filter(({ value }) => value > 0.001);
			console.log(this.$store.state.price.values["dot"]);
			const dotPrice = this.$store.state.price.values["dot"];
			const dotBalance = this.$store.state.web3.balances[
				this.$store.state.web3.tokenSymbol
			];
			return [
				{
					address: this.$store.state.web3.tokenSymbol,
					name: this.$store.state.web3.tokenSymbol,
					symbol: this.$store.state.web3.tokenSymbol,
					price: dotPrice,
					balance: dotBalance,
					value: dotPrice * dotBalance,
				},
				...balances,
			];
		},
		balancesTotalValue() {
			return this.balances.reduce((a, b) => a + b.value, 0);
		},
	},
	mounted() {
		console.log(this.balances);
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
