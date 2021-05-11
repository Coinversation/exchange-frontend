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
import vettedTokenList from "../../config/vetted_tokenlist";
export default {
	props: ["inputType", "tokens"],
	name: "BackendTable",
	data() {
		return {
			// listData: [],
			vettedTokenListData: [],
			collapseDuration: 0,
		};
	},
	computed: {
		listData() {
			console.log(this.vettedTokenListData);
			console.log(this.tokens);
			const that = this;
			for (let i = 0; i < that.tokens.length; i++) {
				for (let j = 0; j < that.vettedTokenListData.length; j++) {
					if (that.vettedTokenListData[j].symbol == that.tokens[i].symbol) {
						that.vettedTokenListData.splice(j, 1);
						j--;
					}
				}
			}
			return that.vettedTokenListData;
			// console.log(this.vettedTokenListData);
			// return this.vettedTokenListData;
		},
	},
	mounted() {
		this.vettedTokenListData = vettedTokenList.tokens;
		// for (let i = 0; i < this.tokens.length; i++) {
		// 	for (let j = 0; j < this.vettedTokenListData.length; j++) {
		// 		if (this.vettedTokenListData[j] == this.tokens[i]) {
		// 			this.vettedTokenListData.splice(j, 1);
		// 			j--;
		// 		}
		// 	}
		// }
		// console.log(this.vettedTokenListData);
		// this.listData = this.vettedTokenListData;
		// this.listData =
		// 	this.vettedTokenListData -
		// 	this.tokens.map((item, id) => {
		// 		return { ...item, id };
		// 	});
	},
	methods: {
		rowClicked(s) {
			this.$emit("filterData", s, this.inputType);
		},
	},
};
</script>
