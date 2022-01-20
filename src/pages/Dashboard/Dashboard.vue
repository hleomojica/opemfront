<template>
  <div class="dashboard-page">
    <h1 class="page-title">Inicio</h1>

    <b-row>
      <b-col xs="12" lg="6" xl="4" v-for="stat in mock.bigStat" :key="stat.id">
        <BigStat
          :product="stat.product"
          :color="stat.color"
          :total="stat.total"
          :registrations="stat.registrations"
          :bounce="stat.bounce"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col xs="12">
        <echart
          :options="cd.echarts.line"
          :init-options="initEchartsOptions"
          style="height: 370px"
        ></echart>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BigStat from "./components/BigStat/BigStat";
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/line";
import mock from "./mock";
import { chartData } from "./mock";

import { Chart } from "highcharts-vue";

export default {
  name: "Dashboard",
  components: {   
    BigStat,
    highcharts: Chart,
    echart: ECharts,
  },
  data() {
    return {
      mock,
      cd: chartData,
      initEchartsOptions: {
        renderer: "canvas",
      },
    };
  },
  methods: {
    getRandomData() {
      const arr = [];

      for (let i = 0; i < 25; i += 1) {
        arr.push(Math.random().toFixed(1) * 10);
      }

      return arr;
    },
    getRevenueData() {
      const data = [];
      const seriesCount = 3;
      const accessories = ["SMX", "Direct", "Networks"];

      for (let i = 0; i < seriesCount; i += 1) {
        data.push({
          label: accessories[i],
          data: Math.floor(Math.random() * 100) + 1,
        });
      }

      return data;
    },
  },
  computed: {
    donut() {
      let revenueData = this.getRevenueData();
      let { danger, info, primary } = this.appConfig.colors;
      let series = [
        {
          name: "Revenue",
          data: revenueData.map((s) => {
            return {
              name: s.label,
              y: s.data,
            };
          }),
        },
      ];
      return {
        chart: {
          type: "pie",
          height: 120,
        },
        credits: {
          enabled: false,
        },
        title: false,
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
            },
            borderColor: null,
            showInLegend: true,
            innerSize: 60,
            size: 100,
            states: {
              hover: {
                halo: {
                  size: 1,
                },
              },
            },
          },
        },
        colors: [danger, info, primary],
        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
          itemStyle: {
            color: "#495057",
            fontWeight: 100,
            fontFamily: "Montserrat",
          },
          itemMarginBottom: 5,
          symbolRadius: 0,
        },
        exporting: {
          enabled: false,
        },
        series,
      };
    },
  },
};
</script>

<style src="./Dashboard.scss" lang="scss" />
