
import { useGetStatsAppointmentCount, useGetStatsByUserAppointment } from '@lib/services/appointmentService'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'

export const DashboardPage = () => {


    const { dataStatsAppointment, isLoadingStatsAppointment } = useGetStatsByUserAppointment()
    const { dataStatsAppointmentCount, isLoadingStatsAppointmentCount } = useGetStatsAppointmentCount()


    const getColorByCitas = (value: number | null) => {
        if (!value) return '#F87171' // rojo suave
        if (value <= 10) return '#F87171' // rojo suave
        if (value <= 30) return '#FBBF24' // amarillo
        if (value <= 60) return '#60A5FA' // azul
        return '#34D399' // verde
    }

    const dataForChart = useMemo(() => {
        if (!dataStatsAppointment) return []

        return [...dataStatsAppointment]
            .reverse()
            .map(item => ({
                username: item.username,
                citas: item.count,
                color: getColorByCitas(item.count),
            }))
    }, [dataStatsAppointment])

    const dataForPieChart = useMemo(() => {
        if (!dataStatsAppointmentCount) return []

        return [
            {
                id: "Pendientes",
                label: "Pendientes",
                value: dataStatsAppointmentCount.pending,
                color: "#F2C94C",

            },
            {
                id: "En Proceso",
                label: "En Proceso",
                value: dataStatsAppointmentCount.in_progress,
                color: "#5C7AEA",
            },
            {
                id: "Completadas",
                label: "Completadas",
                value: dataStatsAppointmentCount.done,
                color: "#6FCF97",

            }
        ]

    }, [dataStatsAppointmentCount])


    const axisTextStyle = {
        fontSize: 18,
        fill: '#111827',
        fontFamily: 'Inter, sans-serif',
    }

    if (isLoadingStatsAppointment || isLoadingStatsAppointmentCount) {
        return <div>Loading...</div>
    }


    return (
        <div className='flex flex-col gap-4 items-center justify-center'>
            <div className='min-h-[300px] w-[600px] border rounded-lg border-gray-200 bg-white shadow-lg'>
                <ResponsiveBar /* or Bar for fixed dimensions */
                    data={dataForChart}
                    keys={["citas"]}
                    colors={({ value }) => getColorByCitas(value)}
                    indexBy="username"
                    layout="horizontal"
                    padding={0.45}
                    borderRadius={4}
                    borderWidth={2}
                    labelSkipWidth={8}
                    animate={true}
                    theme={{
                        axis: {
                            ticks: {
                                text: axisTextStyle,
                            },
                            legend: {
                                text: axisTextStyle,
                            },
                        },
                        labels: {
                            text: {
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 12,
                                fill: '#111827',
                            },
                        },
                        tooltip: {
                            container: {
                                background: '#111827',
                                color: '#fff',
                                fontSize: 12,
                            },
                        },
                    }}
                    axisLeft={{
                        renderTick: (tick) => (
                            <g transform={`translate(${tick.x - 12},${tick.y})`}>
                                <text
                                    style={{ fontSize: 12, fill: '#78829D', fontFamily: 'Inter, sans-serif' }}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                >
                                    {tick.value}
                                </text>
                            </g>
                        ),
                    }}
                    axisBottom={{
                        renderTick: (tick) => (
                            <g transform={`translate(${tick.x},${tick.y})`}>
                                <text
                                    style={{ fontSize: 12, fill: '#78829D', fontFamily: 'Inter, sans-serif' }}
                                    textAnchor="end"
                                >
                                    {tick.value}
                                </text>
                            </g>
                        ),
                    }}
                    axisTop={{
                        renderTick: () => null,
                        legend: 'Ranking de citas por usuario',
                        legendPosition: 'middle',
                        legendOffset: -24,

                    }}
                    margin={{ top: 60, right: 60, bottom: 50, left: 100 }}
                />
            </div>
            <div className='border rounded-lg border-gray-200 bg-white shadow-lg'>
                <div className="flex items-center justify-center pt-4">
                    <p className="text-[#111827] text-lg">Ranking de tus citas por estado</p>
                </div>
                <div className='min-h-[300px] w-[600px]'>
                    <ResponsivePie
                        data={dataForPieChart}
                        key={dataForPieChart.length}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.6} // dona (más pro)
                        padAngle={1}
                        animate={true}
                        motionConfig="wobbly" // prueba también: "gentle", "stiff", "slow"
                        transitionMode="startAngle"
                        cornerRadius={4}
                        colors={dataForPieChart.map(item => item.color)}
                        activeOuterRadiusOffset={6}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#78829D"
                        theme={{
                            labels: {
                                text: {
                                    fontSize: 12,
                                    fontFamily: 'Inter, sans-serif',
                                    fill: '#111827',
                                },
                            },
                            tooltip: {
                                container: {
                                    background: '#111827',
                                    color: '#fff',
                                    fontSize: 12,
                                },
                            },
                        }}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                translateY: 56,
                                itemWidth: 100,
                                itemHeight: 18,
                                symbolShape: 'circle'
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}
