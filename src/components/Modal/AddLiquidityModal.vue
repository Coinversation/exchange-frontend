<template>
	<CModal
		:show.sync="addModal"
		:no-close-on-backdrop="true"
		:centered="true"
		title=""
		size="lg"
		color="dark"
	>
		<CCol xs="12" md="12">
			<CCard>
				<CCardBody>
					<CTabs>
						<CTab title="Multi asset" active>
							<CRow>
								<CCol col="4" class="mt-3 border">
									<h5>Pool overview</h5>
									<p>.............</p>
									<p>My share:</p>
									<p>Swap fee:</p>
									<!-- <UiPie
										class="mr-3"
										size="34"
									/> -->
									<!-- :tokens="item.tokens" -->
								</CCol>
								<CCol col="8">
									<AddLiquidityModalList
										:tokens="tokens"
										:fields="fields"
									/>
								</CCol>
							</CRow>
						</CTab>
						<CTab title="Single asset"> </CTab>
					</CTabs>
				</CCardBody>
			</CCard>
		</CCol>
		<template #header>
			<h6 class="modal-title">Add liquidity</h6>
			<CButtonClose @click="closeMod" class="text-white" />
		</template>
		<template #footer>
			<div></div>
			<!-- <CButton @click="selectAssetModal = false" color="danger"
					>Discard</CButton
				> -->
			<CButton @click="selectAssetModal = false" color="success"
				>Add liquidity</CButton
			>
		</template>
	</CModal>
</template>
<script>
// import UiPie from "../../components/UiPie";
import AddLiquidityModalList from "../../components/List/AddLiquidityModalList";
export default {
	name: "AddLiquidityModal",
	props: ["addModal", "tokens"],
	data() {
		return {
			fields: [
				{
					key: "symbol",
					label: "Assets",
					_classes: "font-weight-bold",
				},
				{ key: "wallet", label: "Wallet balance" },
				{ key: "amount", label: "Deposit amount" },
				// { key: "percent", label: "Percent" },
				// { key: "amount", label: "Amount" },
				// { key: "price", label: "Price" },
				// { key: "totalValue", label: "Total value" },
				// { key: "remove", label: "" },
			],
		};
	},
	components: {
		// UiPie,
		AddLiquidityModalList,
	},
	methods: {
		closeMod() {
			this.$emit("closeAddModal", false);
		},
	},
};
</script>
