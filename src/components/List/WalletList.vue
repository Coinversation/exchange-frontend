<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					hover
					:items="items"
					:fields="fields"
					:items-per-page="15"
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="address" slot-scope="{ item }">
						<td>
							<div class="d-flex">
								<img
									class="mr-3"
									:style="{
										width: '35px',
										height: '35px',
										'border-radius': '35px',
										'background-color': randomColor(
											item.address
										),
									}"
								/>
								<!-- <Jazzicon
									:address="item.address"
									:diameter="40"
									shape-count="6"
								/> -->
								<span class="ml-2 mr-3">
									<h5 class="m-0">{{ item.name }}</h5>
									<span>{{ item.symbol }}</span>
								</span>
							</div>
						</td>
					</template>

					<template slot="price" slot-scope="{ item }">
						<td>
							<span>{{ item.balance }} {{ item.symbol }}</span>
							<p>$ {{ item.value }}</p>
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
import Jazzicon from "vue3-jazzicon/src/components";
import { addressEq } from "@polkadot/util-crypto";

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
	computed: {},
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
	components: {
		// Jazzicon,
	},
	mounted() {
		console.log(this.items);
	},
	methods: {
		randomColor(s) {
			console.log(Number.parseInt(s));
			return "#" + Math.random().toString(16).slice(-6);
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
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
		validator(val) {
			return val ? val.length >= 4 : false;
		},
	},
};
</script>
