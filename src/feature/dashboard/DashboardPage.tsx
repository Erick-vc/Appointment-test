
import { useGetStatsByUserAppointment } from '@lib/services/appointmentService'
import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'

export const DashboardPage = () => {


    const { dataStatsAppointment, isLoadingStatsAppointment } = useGetStatsByUserAppointment()
    console.log('dataStatsAppointment', dataStatsAppointment)


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


    const axisTextStyle = {
        fontSize: 24,
        fill: '#78829D',
        fontFamily: 'Inter, sans-serif',
    }

    if (isLoadingStatsAppointment) {
        return <div>Loading...</div>
    }


    return (
        <div className='h-full flex items-center justify-center'>
            <div className='h-[300px] w-[600px] border rounded-lg border-gray-200 shadow-lg'>
                <ResponsiveBar /* or Bar for fixed dimensions */
                    data={dataForChart}
                    keys={["citas"]}
                    colors={({ value }) => getColorByCitas(value)}
                    indexBy="username"
                    layout="horizontal"
                    padding={0.45}
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
                        legend: 'Citas',
                        legendPosition: 'middle',
                        legendOffset: -10,

                    }}
                    margin={{ top: 60, right: 60, bottom: 50, left: 100 }}
                />
            </div>
        </div>
    )
}
