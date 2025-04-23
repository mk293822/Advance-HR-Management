import React, { useEffect, useRef } from "react";
import ActionButton from "../ActionButton";
import { router } from "@inertiajs/react";
import Chart from "chart.js/auto";
import { AttendanceProps } from "@/types/Admin";

const AttendanceChart = ({
    attendances,
    chart_type,
}: {
    attendances: AttendanceProps[];
    chart_type: string;
}) => {
    const chartRef = useRef(null);

    // Chart
    useEffect(() => {
        let chartInstance: Chart | null = null;

        let labels: string[] = [];
        let presentData: number[] = [];
        let absentData: number[] = [];
        let halfDayData: number[] = [];

        if (chart_type === "month") {
            // Generate monthly data
            const monthlyData: Array<{
                present: number;
                absent: number;
                late: number;
                leave: number;
                half_day: number;
            }> = Array.from({ length: 12 }, () => ({
                present: 0,
                absent: 0,
                half_day: 0,
                leave: 0,
                late: 0,
            }));

            attendances.forEach((attendance) => {
                const date = new Date(attendance.date);
                const month = date.getMonth();
                const year = date.getFullYear();
                const status = attendance.status;

                if (year === new Date().getFullYear()) {
                    if (status in monthlyData[month]) {
                        monthlyData[month][
                            status as keyof (typeof monthlyData)[number]
                        ] += 1;
                    }
                }
            });

            const currentMonth = new Date().getMonth();
            labels = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];

            presentData = monthlyData.map((m, i) =>
                i <= currentMonth ? m.present + m.late : 0
            );
            absentData = monthlyData.map((m, i) =>
                i <= currentMonth ? m.absent + m.leave : 0
            );
            halfDayData = monthlyData.map((m, i) =>
                i <= currentMonth ? m.half_day : 0
            );
        } else {
            // Generate daily data for current month
            const daysInMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
            ).getDate();

            const dailyData = Array.from({ length: daysInMonth }, () => ({
                present: 0,
                absent: 0,
                half_day: 0,
                leave: 0,
                late: 0,
            }));

            attendances.forEach((attendance) => {
                const date = new Date(attendance.date);
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();

                if (
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear()
                ) {
                    if (attendance.status in dailyData[day - 1]) {
                        dailyData[day - 1][
                            attendance.status as keyof (typeof dailyData)[number]
                        ] += 1;
                    }
                }
            });

            labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

            presentData = dailyData.map((m) => m.present + m.late);
            absentData = dailyData.map((m) => m.absent + m.leave);
            halfDayData = dailyData.map((m) => m.half_day);
        }

        if (chartRef.current) {
            chartInstance = new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Present",
                            data: presentData,
                            borderColor: "#16a34a", // Emerald Green
                            pointBackgroundColor: "#16a34a",
                            borderWidth: 2,
                            fill: false,
                            tension: 0,
                            spanGaps: true,
                            pointRadius: 3,
                            backgroundColor: "#16a34a",
                        },
                        {
                            label: "Absent",
                            data: absentData,
                            borderColor: "#dc2626", // Strong Red
                            pointBackgroundColor: "#dc2626",
                            borderWidth: 2,
                            fill: false,
                            tension: 0,
                            spanGaps: true,
                            pointRadius: 3,
                            backgroundColor: "#dc2626",
                        },
                        {
                            label: "Half Day",
                            data: halfDayData,
                            borderColor: "#7c3aed", // Vivid Purple
                            pointBackgroundColor: "#7c3aed",
                            borderWidth: 2,
                            fill: false,
                            tension: 0,
                            spanGaps: true,
                            pointRadius: 3,
                            backgroundColor: "#7c3aed",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            });
        }

        return () => {
            chartInstance?.destroy();
        };
    }, [attendances, chart_type]);

    return (
        <div className="bg-gray-800 p-6 hidden md:block rounded-lg shadow col-span-full">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold mb-4">
                    Employee Attendances
                </h2>
                <div className="flex items-center justify-end w-[50%] gap-4">
                    <ActionButton
                        type="button"
                        color="blue"
                        onClick={() =>
                            router.visit(
                                route("dashboard", {
                                    chart:
                                        chart_type === "month"
                                            ? "day"
                                            : "month",
                                })
                            )
                        }
                    >
                        {chart_type === "month"
                            ? "Switch To Day View"
                            : "Switch To Month View"}
                    </ActionButton>

                    <small>{new Date().toLocaleDateString()}</small>
                </div>
            </div>
            <canvas ref={chartRef} height="100"></canvas>
        </div>
    );
};

export default AttendanceChart;
