<template>
	<Pie :values="values" :colors="colors" :size="size" />
</template>

<script>
import Pie from "../components/Pie";

export default {
	props: ["tokens", "size"],
	components: {
		Pie,
	},
	computed: {
		values() {
			return this.tokens.map((token) => parseFloat(token.denormWeight));
		},
		colors() {
			return this.tokens.map((token) => token.color);
		},
	},
};
</script>
