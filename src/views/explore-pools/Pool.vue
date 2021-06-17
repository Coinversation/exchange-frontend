<template>
	<CRow>
		<CCol col="12">
			<CCardBody>
				<div class="row">
					<div class="col-6 d-flex">
						<UiPie
							:tokens="tokenDetails.tokens"
							class="mr-3"
							size="50"
						/>
						<div>
							<div>Coinversation Pool Token</div>
							<h3>$</h3>
						</div>
					</div>
					<div
						class="col-6 d-flex justify-content-end"
						style="height: 40px"
					>
						<CButton
							class="mr-2"
							color="primary"
							@click="addLiquidityMod"
						>
							Add liquidity
						</CButton>
						<CButton
							color="primary"
							variant="outline"
							@click="darkModal = true"
							>Remove liquidity
						</CButton>
					</div>
				</div>
			</CCardBody>
			<CCard>
				<CCardHeader> Id: {{ $route.params.id }} </CCardHeader>
				<CCardBody>
					<CRow>
						<CCol sm="12" lg="12">
							<CRow>
								<CCol sm="3">
									<CCallout color="info">
										<small class="text-muted"
											>Liquidity</small
										><br />
										<strong class="h4">9,123</strong>
									</CCallout>
								</CCol>
								<CCol sm="3">
									<CCallout color="danger">
										<small class="text-muted"
											>Volume (24h)</small
										><br />
										<strong class="h4">22,643</strong>
									</CCallout>
								</CCol>

								<CCol sm="3">
									<CCallout color="warning">
										<small class="text-muted"
											>Swap fee</small
										><br />
										<strong class="h4">78,623</strong>
									</CCallout>
								</CCol>
								<CCol sm="3">
									<CCallout color="success">
										<small class="text-muted"
											>My pool share</small
										><br />
										<strong class="h4">49,123</strong>
									</CCallout>
								</CCol>
							</CRow>
						</CCol>
					</CRow>
					<br />
				</CCardBody>
			</CCard>
			<CCard>
				<CCardBody>
					<CTabs>
						<CTab title="Liquidity" active>
							<MainChartExample
								style="height: 300px; margin-top: 40px"
							/>
						</CTab>
						<CTab title="Volume">
							<!-- <div style="height: 300px; margin-top: 40px"> -->
							<CChartBarExample
								style="height: 300px; margin-top: 40px"
							/>
							<!-- </div> -->
						</CTab>
						<CTab title="Fee returns">
							<MainChartExample
								style="height: 300px; margin-top: 40px"
							/>
						</CTab>
					</CTabs>
				</CCardBody>
				<CCardBody>
					<!-- <CDataTable
						striped
						small
						fixed
						:items="visibleData"
						:fields="fields"
					/> -->
				</CCardBody>
				<CCardFooter>
					<CButton color="primary" @click="goBack">Back</CButton>
				</CCardFooter>
			</CCard>
		</CCol>
		<AddLiquidityModal
			:tokens="tokenDetails.tokens"
			:addModal="addModal"
			@closeAddModal="closeAddModal"
		/>
	</CRow>
</template>

<script>
import UiPie from "../../components/UiPie";
import CChartBarExample from "../../components/Pool/CChartBarExample";
import MainChartExample from "../../components/Pool/MainChartExample";
import AddLiquidityModal from "../../components/Modal/AddLiquidityModal";
// import Chart from "../../components/Pool/Chart";
import { details } from "@/api";

export default {
	name: "User",
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.usersOpened = from.fullPath.includes("explore-pools");
		});
	},
	components: {
		UiPie,
		CChartBarExample,
		MainChartExample,
		AddLiquidityModal,
	},
	data() {
		return {
			selected: "Month",
			usersOpened: null,
			tokenDetails: {},
			addModal: false,
		};
	},
	computed: {
		fields() {
			return [
				{ key: "key", label: this.username, _style: "width:150px" },
				{ key: "value", label: "", _style: "width:150px;" },
			];
		},
		// userData() {
		// 	const id = this.$route.params.id;
		// 	const user = this.item.find((user, index) => index + 1 == id);
		// 	const userDetails = user
		// 		? Object.entries(user)
		// 		: [["id", "Not found"]];
		// 	return userDetails.map(([key, value]) => {
		// 		return { key, value };
		// 	});
		// },
		// visibleData() {
		// 	return this.userData.filter((param) => param.key !== "username");
		// },
		// username() {
		// 	return this.userData.filter((param) => param.key === "username")[0]
		// 		.value;
		// },
	},
	created() {
		// console.log(this.$route.params.id)
		this.getDetails();
	},
	methods: {
		getDetails() {
			details(this.$route.params.id).then(({ data }) => {
                if (data.code == 0) {
                    this.tokenDetails = data.data;
                    console.log(183, this.tokenDetails.tokens);
				}
			});
		},
		goBack() {
			this.usersOpened
				? this.$router.go(-1)
				: this.$router.push({ path: "/explore-pools" });
		},
		addLiquidityMod() {
			this.addModal = this.addModal === true ? false : true;
		},
		closeAddModal() {
			console.log(123);
			this.addModal = false;
		},
	},
};
</script>
