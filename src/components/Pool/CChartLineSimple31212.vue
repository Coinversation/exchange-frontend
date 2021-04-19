<template>
	<CChartLine :datasets="defaultDatasets" labels="months" />
</template>

<script>
import { CChartLine } from "@coreui/vue-chartjs";
// import { getColor, deepObjectsMerge } from "@coreui/utils/src";

export default {
	name: "CChartLineSimple",
	components: { CChartLine },
	// props: {
	// 	...CChartLine.props,
	// 	borderColor: {
	// 		type: String,
	// 		default: "rgba(255,255,255,.55)",
	// 	},
	// 	backgroundColor: {
	// 		type: String,
	// 		default: "transparent",
	// 	},
	// 	dataPoints: {
	// 		type: Array,
	// 		default: () => [10, 22, 34, 46, 58, 70, 46, 23, 45, 78, 34, 12],
	// 	},
	// 	label: {
	// 		type: String,
	// 		default: "Sales",
	// 	},
	// 	pointed: Boolean,
	// 	pointHoverBackgroundColor: String,
	// },
	computed: {
		// pointHoverColor() {
		// 	if (this.pointHoverBackgroundColor) {
		// 		return this.pointHoverBackgroundColor;
		// 	} else if (this.backgroundColor !== "transparent") {
		// 		return this.backgroundColor;
		// 	}
		// 	return this.borderColor;
		// },
		// defaultDatasets() {
		// 	return [
		// 		{
		// 			data: this.dataPoints,
		// 			borderColor: getColor(this.borderColor),
		// 			backgroundColor: getColor(this.backgroundColor),
		// 			pointBackgroundColor: getColor(this.pointHoverColor),
		// 			pointHoverBackgroundColor: getColor(this.pointHoverColor),
		// 			label: this.label,
		// 		},
		// 	];
		// },
		// pointedOptions() {
		// 	return {
		// 		scales: {
		// 			xAxes: [
		// 				{
		// 					offset: true,
		// 					gridLines: {
		// 						color: "transparent",
		// 						zeroLineColor: "transparent",
		// 					},
		// 					ticks: {
		// 						fontSize: 2,
		// 						fontColor: "transparent",
		// 					},
		// 				},
		// 			],
		// 			yAxes: [
		// 				{
		// 					display: true,
		// 					ticks: {
		// 						display: true,
		// 						min: Math.min.apply(Math, this.dataPoints) - 5,
		// 						max: Math.max.apply(Math, this.dataPoints) + 5,
		// 					},
		// 				},
		// 			],
		// 		},
		// 		elements: {
		// 			line: {
		// 				borderWidth: 1,
		// 			},
		// 			point: {
		// 				radius: 4,
		// 				hitRadius: 10,
		// 				hoverRadius: 4,
		// 			},
		// 		},
		// 	};
		// },
		// straightOptions() {
		// 	return {
		// 		scales: {
		// 			xAxes: [
		// 				{
		// 					display: true,
		// 				},
		// 			],
		// 			yAxes: [
		// 				{
		// 					display: true,
		// 				},
		// 			],
		// 		},
		// 		elements: {
		// 			line: {
		// 				borderWidth: 2,
		// 			},
		// 			point: {
		// 				radius: 0,
		// 				hitRadius: 10,
		// 				hoverRadius: 4,
		// 			},
		// 		},
		// 	};
		// },
		// defaultOptions() {
		// 	const options = this.pointed
		// 		? this.pointedOptions
		// 		: this.straightOptions;
		// 	return Object.assign({}, options, {
		// 		maintainAspectRatio: true,
		// 		legend: {
		// 			display: true,
		// 		},
		// 	});
		// },
		// computedDatasets() {
		// 	return deepObjectsMerge(this.defaultDatasets, this.datasets || {});
		// },
		// computedOptions() {
		// 	return deepObjectsMerge(this.defaultOptions, this.options || {});
		// },
        defaultDatasets() {
			return [
				{
					label: "GitHub Commits",
					backgroundColor: "#d7d7d7",
					data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
				},
			];
		},
	},
};
</script>
