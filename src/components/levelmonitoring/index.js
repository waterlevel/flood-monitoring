import Chart from "react-apexcharts";

export default function WaterLevelMonitoring({ data }) {

    const series = [
        {
            data: data
        }
    ];
    const options = {
        chart: {
            background: 'url(https://www.fondriest.com/environmental-measurements/wp-content/uploads/2015/09/flood_installationconsider.jpg) no-repeat 100%',
            height: 350,
            type: "line",
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2,
            curve: "smooth"
        },
        colors: ["yellow", "orange", "red"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: true,
                gradientToColors: ["#db1616"],
                opacityFrom: 1,
                opacityTo: 1,
                type: "vertical",
                stops: [0, 30]
            }
        }
    };
    return (
        <div id="chart">
            <Chart options={options} series={series} type="line" height={350} />
        </div>
    );
}