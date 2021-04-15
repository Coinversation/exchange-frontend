<template>
	<CCardBody>
		<CDataTable
			:items="listData"
			:fields="['name', 'symbol']"
			items-per-page-select
			:items-per-page="10"
			hover
			pagination
			table-filter
			cleaner
            clickableRows
            placeholder="Search name, symbol or address"
		>
			<template slot="name" slot-scope="{ item }">
				<td>
					<img
						class="mr-3"
						style="width: 35px; border-radius: 30px"
						:src="item.logoURI"
					/>
					<span>{{ item.name }}</span>
				</td>
			</template>
			<template slot="symbol" slot-scope="{ item }">
				<td>
					<span>{{ item.symbol }}</span>
				</td>
			</template>
		</CDataTable>
	</CCardBody>
</template>

<script>
// import vettedTokenListData from "./UsersData";

export default {
	props: ["vettedTokenListData"],
	name: "BackendTable",
	data() {
		return {
			listData: this.vettedTokenListData.map((item, id) => {
				return { ...item, id };
			}),
			details: [],
			collapseDuration: 0,
		};
	},
	// methods: {
	// 	onTableChange() {
	// 		this.loading = true;
	// 		setTimeout(() => {
	// 			this.loading = false;
	// 			const agent = this.$refs.externalAgent;
	// 			this.loadedItems = agent.currentItems;
	// 			this.pages = Math.ceil(agent.sortedItems.length / 10);
	// 		}, 1000);
	// 	},
	// },
};
</script>
