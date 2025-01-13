import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { ApexOptions } from "apexcharts";
import { getDashboardPopulation } from "../../services/dashboard-service";

const { Title } = Typography;

function LineChart() {
  const { t, i18n } = useTranslation();
  const [key, setKey] = useState(0);
  const [successData, setSuccessData] = useState<Array<number>>([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [failureData, setFailureData] = useState<Array<number>>([0,0,0,0,0,0,0,0,0,0,0,0]);
  const dispatch = useDispatch<AppDispatch>();

  const series =  [
    {
      name: t('dashboard_component.success_color_line_chart'),
      data: successData,
      offsetY: 0,
    },
    {
      name: t('dashboard_component.failure_color_line_chart'),
      data: failureData,
      offsetY: 0,
    },
  ];

  const options: ApexOptions = {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    yaxis: {
      labels: {
        show: true, 
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#8c8c8c"],
        },
      },
    },
    xaxis: {
      categories: [
        t('dashboard_component.jan_line_chart'),
        t('dashboard_component.feb_line_chart'),
        t('dashboard_component.mar_line_chart'),
        t('dashboard_component.apr_line_chart'),
        t('dashboard_component.may_line_chart'),
        t('dashboard_component.jun_line_chart'),
        t('dashboard_component.jul_line_chart'),
        t('dashboard_component.aug_line_chart'),
        t('dashboard_component.sep_line_chart'),
        t('dashboard_component.oct_line_chart'),
        t('dashboard_component.nov_line_chart'),
        t('dashboard_component.dec_line_chart'),
      ]
    },
  };  

  useEffect(() => {
    // Reset the chartKey whenever the language changes to trigger a re-render
    getDashboardPopulation("month_with_success_failure").then((data) => {
      setSuccessData(data.success);
      setFailureData(data.failure);
    });

    // Add a delay before updating the key
    const timer = setTimeout(() => {
      setKey(prevKey => prevKey + 1);
    }, 500);

    return () => clearTimeout(timer);

  }, [i18n.language, dispatch]);

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>{t('dashboard_component.success_and_failure_chart')}</Title>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} {t('dashboard_component.success_color_line_chart')}</li>
            <li>{<MinusOutlined />} {t('dashboard_component.failure_color_line_chart')}</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        key={key}
        className="full-width"
        options={options}
        series={series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;