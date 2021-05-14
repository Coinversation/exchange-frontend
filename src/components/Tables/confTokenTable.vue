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
						:src="item.logoURL"
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

export default {
	props: ["inputType", "tokenFilterList",'listData'],
	name: "BackendTable",
	data() {
		return {
			collapseDuration: 0,
			// vettedTokenListData: [],
		};
	},
	computed: {
		// vettedTokenListData() {
		// 	console.log(this.$store.state);
		// 	return this.$store.state.vettedTokenListData;
		// },

	},
	created() {

	},
	methods: {
		rowClicked(s) {
			this.$emit("filterData", s, this.inputType);
		},
	},
};
</script>
