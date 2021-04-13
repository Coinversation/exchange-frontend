<template>
	<CRow>
		<CCol>
			<!-- <CCard> -->
			<!-- <CCardHeader @click="item++">
					<CIcon name="cil-justify-center" />
					<strong> Bootstrap Navs </strong>
					<small>pill style</small>
				</CCardHeader> -->
			<CCardBody>
				<CNav variant="pills">
					<CNavItem active>Shared</CNavItem>
					<CNavItem>Private</CNavItem>
					<!-- <CNavItem>Another Link</CNavItem>
						<CNavItem disabled>Disabled</CNavItem> -->
				</CNav>
			</CCardBody>
			<!-- </CCard> -->
		</CCol>
		<CCol col="12" xl="12">
			<CCard>
				<CCardBody>
					<CDataTable
						hover
						:items="items"
						:fields="fields"
						:items-per-page="5"
						clickable-rows
						:active-page="activePage"
						@row-clicked="rowClicked"
						:pagination="{ doubleArrows: false, align: 'center' }"
						@page-change="pageChange"
					>
						<td
							class="text-center d-flex justify-content-start"
							slot="assets"
							slot-scope="{ item }"
						>
							<div class="pie">
								<Pie
									:tokens="item.assets"
									class="mr-3"
									size="34"
								/>
							</div>
							<span
								class="d-flex justify-content-center align-items-center mr-2"
								v-for="(data, index) in item.assets"
								:key="index"
							>
								<i
									class="m-1 bg-primary d-flex justify-content-center"
									style="
										width: 10px;
										height: 10px;
										border-radius: 10px;
									"
								></i>
								{{ data.num }}
								{{ data.name }}
							</span>
						</td>

						<!-- <template>
							<div class="pie">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 32 32"
								>
									<circle
										cx="16"
										cy="16"
										r="16"
										stroke-dasharray="20 100"
										fill="lightskyblue"
										stroke="lightseagreen"
									></circle>
									<circle
										cx="16"
										cy="16"
										r="16"
										stroke-dasharray="40 100"
										stroke-dashoffset="-20"
										fill="transparent"
										stroke="lightgoldenrodyellow"
									></circle>
								</svg>
							</div>
						</template> -->

						<!-- <template #status="data">
							<td>
								<CBadge
									:color="getBadge(data.item.assets.key1)"
								>
									{{ data.item.assets.key1 }}
								</CBadge>
							</td>
						</template> -->
					</CDataTable>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>

<script>
import usersData from "./UsersData";
import Pie from "../../components/Pie";
export default {
	name: "Users",
	data() {
		return {
			items: usersData,
			fields: [
				{
					key: "poolAddress",
					label: "Pool address",
					_classes: "font-weight-bold",
				},
				{ key: "assets", label: "Assets" },
				{ key: "swapFee", label: "Swap fee" },
				{ key: "marketCap", label: "Market cap" },
				{ key: "myLiquidity", label: "My liquidity" },
				{ key: "Volume", label: "Volume (24h)" },
			],
			activePage: 1,
		};
	},
	components: {
		Pie,
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
		rowClicked(item, index) {
			this.$router.push({ path: `users/${index + 1}` });
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
