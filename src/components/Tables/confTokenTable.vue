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
	props: ["inputType", "tokenFilterList"],
	name: "BackendTable",
	data() {
		return {
			collapseDuration: 0,
		};
	},
	computed: {
		listData() {
			console.log(this.vettedTokenListData);
			console.log(this.tokenFilterList);
			const that = this;
			for (let i = 0; i < this.tokenFilterList.length; i++) {
				for (let j = 0; j < this.vettedTokenListData.length; j++) {
					if (
						this.vettedTokenListData[j].symbol ==
						this.tokenFilterList[i].symbol
					) {
						that.vettedTokenListData.splice(j, 1);
						j--;
					}
				}
			}
			console.log(60, this.vettedTokenListData);
			return this.$store.commit(
				"VETTED_TOKEN_LIST_DATA",
				this.vettedTokenListData
			);
			// return this.vettedTokenListData;
			// return this.vettedTokenListData;
		},
		vettedTokenListData() {
			return this.$store.state.vettedTokenListData;
		},
	},
	methods: {
		rowClicked(s) {
			this.$emit("filterData", s, this.inputType);
		},
	},
};
</script>
