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
					@row-clicked="rowClicked"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
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
	</CCol>
</template>

<script>
import UiPie from "../../components/UiPie";
export default {
	name: "ListPool",
	props: ["items"],
	data() {
		return {
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
		rowClicked(item, index) {
			this.$router.push({ path: `users/${index + 1}` });
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
