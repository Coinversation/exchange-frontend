<template>
	<CChartBar
		:datasets="defaultDatasets"
		:options="defaultOptions"
		labels="months"
	/>
</template>

<script>
import { CChartBar } from "@coreui/vue-chartjs";
// import { getStyle, hexToRgba } from "@coreui/utils/src";

// function random(min, max) {
// 	return Math.floor(Math.random() * (max - min + 1) + min);
// }

export default {
	name: "CChartBarExample",
	components: { CChartBar },
	computed: {
		defaultDatasets() {
			return [
				{
					label: "GitHub Commits",
					backgroundColor: "#f87979",
					data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
				},
			];
		},
		defaultOptions() {
			return {
				maintainAspectRatio: false,
				legend: {
					display: false,
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								drawOnChartArea: false,
							},
						},
					],
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
								maxTicksLimit: 5,
								stepSize: Math.ceil(250 / 5),
								max: 250,
							},
							gridLines: {
								display: true,
							},
						},
					],
				},
				elements: {
					point: {
						radius: 0,
						hitRadius: 10,
						hoverRadius: 4,
						hoverBorderWidth: 3,
					},
				},
			};
		},
	},
};
</script>
