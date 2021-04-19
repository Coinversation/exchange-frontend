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
			@row-clicked="rowClicked"
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
	methods: {
		rowClicked(s) {
			// console.log(s);
			this.$emit("filterData", s);
		},
	},
};
</script>
