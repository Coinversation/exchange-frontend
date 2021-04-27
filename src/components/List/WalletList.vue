<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					hover
					:items="items"
					:fields="fields"
					:items-per-page="15"
					clickable-rows
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="asset" slot-scope="{ item }">
						<td>
							<div class="d-flex">
								<img
									class="mr-3"
									style="
										width: 35px;
										height: 35px;
										border-radius: 35px;
										background-color: #d7d7d7;
									"
									:src="item.logoURI"
								/>
								<span class="mr-3">
									<h5 class="m-0">Wrapped Ether</h5>
									<span>{{ item.name }}WETH</span>
								</span>
								<!-- <span>
									<CButton
										block
										color="info"
										@click="darkModal = true"
									>
										Unwrap to ETH
									</CButton>
								</span> -->
							</div>
						</td>
					</template>
					<template slot="tokens" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<div class="pie">
									<UiPie
										:tokens="item.tokens"
										class="mr-3"
										size="34"
									/>
								</div>
								<span
									class="d-flex justify-content-center align-items-center mr-2"
									v-for="(data, index) in item.tokens"
									:key="index"
								>
									<i
										class="m-1 d-flex justify-content-center"
										:style="{
											width: '10px',
											height: '10px',
											borderRadius: '10px',
											backgroundColor: data.color,
										}"
									></i>
									{{ data.num }}
									{{ data.symbol }}
								</span>
							</div>
						</td>
					</template>

					<template slot="swapFee" slot-scope="{ item }">
						<td>
							<span>{{ item.swapFee }}%</span>
						</td>
					</template>
					<template slot="marketCap" slot-scope="{ item }">
						<td>
							<span>${{ item.marketCap }}M</span>
						</td>
					</template>
					<template slot="liquidity" slot-scope="{ item }">
						<td>
							<span
								v-if="
									item.liquidity !== '0' &&
									item.liquidity !== ''
								"
								>${{ item.liquidity }}M</span
							>
							<span v-else>-</span>
						</td>
					</template>
					<template slot="volume" slot-scope="{ item }">
						<td>
							<span>${{ item.volume }}M</span>
						</td>
					</template>
				</CDataTable>
			</CCardBody>
		</CCard>
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
					<CCardBody>
						<CForm>
							<CInput
								label="Send"
								valid-feedback="Input is valid."
								invalid-feedback="Please provide at least 4 characters."
								value=""
								:is-valid="validator"
								:append="text1"
							>
								<template #append>
									<CButton type="submit" color="primary"
										>Submit</CButton
									>
									<h5 class="mt-1 ml-3">{{ text1 }}</h5>
								</template></CInput
							>
							<CInput
								label="Receive"
								valid-feedback="Thank you :)"
								invalid-feedback="Please provide at least 4 characters."
								:is-valid="validator"
								:append="text2"
							>
								<template #append>
									<h5 class="mt-1 ml-3">{{ text2 }}</h5>
								</template></CInput
							>
						</CForm>
					</CCardBody>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Wrap ETH to wETH</h6>
				<CButtonClose @click="darkModal = false" class="text-white" />
			</template>
			<template #footer>
				<div></div>
				<CButton @click="darkModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="darkModal = false" color="success"
					>Confirm</CButton
				>
			</template>
		</CModal>
	</CCol>
</template>

<script>
import UiPie from "../../components/UiPie";
export default {
	name: "ListPool",
	props: ["items", "fields"],
	data() {
		return {
			activePage: 1,
			darkModal: false,
			text1: "WETH",
			text2: "ETH",
		};
	},
	components: {
		UiPie,
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
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
		validator(val) {
			return val ? val.length >= 4 : false;
		},
	},
};
</script>
