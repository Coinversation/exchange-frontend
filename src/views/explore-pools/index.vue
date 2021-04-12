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
						<!-- <template #status="data">
							<td>
								<CBadge :color="getBadge(data.item.status)">
									{{ data.item.status }}
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
