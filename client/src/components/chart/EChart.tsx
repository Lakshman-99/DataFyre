import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getDashboardPopulation } from "../../services/dashboard-service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

const { Title } = Typography;

function EChart() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<Array<number>>([0,0,0,0,0,0,0,0,0,0,0,0]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      width: "100%",
      height: "auto",

      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      borderColor: "#ccc",
      strokeDashArray: 2,
    },
    xaxis: {
      categories: [
        t('dashboard_component.jan_echart'),
        t('dashboard_component.feb_echart'),
        t('dashboard_component.mar_echart'),
        t('dashboard_component.apr_echart'),
        t('dashboard_component.may_echart'),
        t('dashboard_component.jun_echart'),
        t('dashboard_component.jul_echart'),
        t('dashboard_component.aug_echart'),
        t('dashboard_component.sep_echart'),
        t('dashboard_component.oct_echart'),
        t('dashboard_component.nov_echart'),
        t('dashboard_component.dec_echart'),
      ],
      labels: {
        show: true,
        style: {
          colors: [
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
          ],
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: "right",
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: [
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
          ],
        },
      },
    },

    tooltip: {
      y: {
        formatter: function (val: number) {
          return "" + val;
        },
      },
    },

  };

  const series = [
    {
      name: t('dashboard_component.population_echart'),
      data: data,
      color: "#fff",
    },
  ];

  useEffect(() => {
    getDashboardPopulation("month").then((res) => {
      setData(res);
    });
  }, [dispatch]);

  return (
    <>
        <div className="linechart">
          <div>
            <Title level={5}>{t('dashboard_component.total_population')}</Title>
          </div>
        </div>
        <br />
        <ReactApexChart
          className="bar-chart"
          options={options}
          series={series}
          type="bar"
          height={350}
        />
    </>
  );
}
export default EChart;