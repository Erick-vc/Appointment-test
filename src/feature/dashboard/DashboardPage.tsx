import {
    useGetAppointment,
    useGetAppointmentDashboard,
    useGetStatsAppointmentCount,
    useGetStatsByUserAppointment,
} from "@lib/services/appointmentService";
import type { TAppointmentResponse } from "@lib/types/appointment";
import type {
    TDashboardMonthlyPoint,
    TDashboardRankingItem,
    TDashboardRecentActivityItem,
} from "@lib/types/dashboard";
import { useMemo } from "react";
import { DashboardDataBadge } from "./components/DashboardDataBadge";
import { DashboardRankingList } from "./components/DashboardRankingList";
import { DashboardRecentActivity } from "./components/DashboardRecentActivity";
import { DashboardSectionCard } from "./components/DashboardSectionCard";
import { DashboardStatCard } from "./components/DashboardStatCard";
import { DashboardStatusChart } from "./components/DashboardStatusChart";
import { DashboardTrendChart } from "./components/DashboardTrendChart";


const getMonthLabel = (date: Date) =>
    new Intl.DateTimeFormat("es-PE", { month: "short" })
        .format(date)
        .replace(".", "")
        .replace(/^./, (char) => char.toUpperCase());

const buildMonthlyFallback = (
    appointments: TAppointmentResponse[]
): TDashboardMonthlyPoint[] => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        return {
            month,
            label: getMonthLabel(date),
            created: 0,
            completed: 0,
            pending: 0,
        };
    });

    appointments.forEach((appointment) => {
        const createdAt = new Date(appointment.created_at);
        if (Number.isNaN(createdAt.getTime())) return;

        const bucketKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
        const bucket = buckets.find((item) => item.month === bucketKey);
        if (!bucket) return;

        bucket.created += 1;
        if (appointment.status === "done") bucket.completed += 1;
        if (appointment.status === "pending" || appointment.status === "in_progress") {
            bucket.pending += 1;
        }
    });

    return buckets;
};

const buildRecentFallback = (
    appointments: TAppointmentResponse[]
): TDashboardRecentActivityItem[] => {
    return [...appointments]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)
        .map((appointment) => ({
            id: appointment.id,
            type: "created" as const,
            username: `user#${appointment.owner}`,
            appointment_name: appointment.name,
            created_at: appointment.created_at,
            description: appointment.description,
        }));
};

export const DashboardPage = () => {


    const { dataAppointments = [], isLoadingAppointments } = useGetAppointment();
    const { dataStatsAppointment, isLoadingStatsAppointment } =
        useGetStatsByUserAppointment();
    const { dataStatsAppointmentCount, isLoadingStatsAppointmentCount } =
        useGetStatsAppointmentCount();
    const { dataAppointmentDashboard, isLoadingAppointmentDashboard } =
        useGetAppointmentDashboard();

    const totalAppointments = useMemo(() => {
        return dataAppointmentDashboard?.summary?.total ?? dataAppointments.length ?? 0;
    }, [dataAppointmentDashboard?.summary?.total, dataAppointments.length]);

    const completedAppointments = useMemo(() => {
        return (
            dataAppointmentDashboard?.summary?.completed ??
            dataAppointmentDashboard?.status_distribution?.completed ??
            dataStatsAppointmentCount?.done ??
            dataAppointments.filter((item) => item.status === "done").length
        );
    }, [dataAppointmentDashboard, dataStatsAppointmentCount, dataAppointments]);

    const pendingAppointments = useMemo(() => {
        const fallbackPending = dataAppointments.filter(
            (item) => item.status === "pending" || item.status === "in_progress"
        ).length;

        return (
            dataAppointmentDashboard?.summary?.pending ??
            dataAppointmentDashboard?.status_distribution?.pending ??
            (dataStatsAppointmentCount
                ? dataStatsAppointmentCount.pending + dataStatsAppointmentCount.in_progress
                : fallbackPending)
        );
    }, [dataAppointmentDashboard, dataStatsAppointmentCount, dataAppointments]);

    const canceledAppointments = useMemo(() => {
        return (
            dataAppointmentDashboard?.summary?.canceled ??
            dataAppointmentDashboard?.status_distribution?.canceled ??
            0
        );
    }, [dataAppointmentDashboard]);

    const monthlyData = useMemo(() => {
        if (dataAppointmentDashboard?.monthly_trend?.length) {
            return dataAppointmentDashboard.monthly_trend;
        }

        return buildMonthlyFallback(dataAppointments);
    }, [dataAppointmentDashboard?.monthly_trend, dataAppointments]);

    const rankingData = useMemo<TDashboardRankingItem[]>(() => {
        if (dataAppointmentDashboard?.ranking_by_user?.length) {
            return dataAppointmentDashboard.ranking_by_user;
        }

        return (dataStatsAppointment ?? []).map((item) => ({
            username: item.username,
            count: item.count,
        }));
    }, [dataAppointmentDashboard?.ranking_by_user, dataStatsAppointment]);

    const recentActivity = useMemo(() => {
        if (dataAppointmentDashboard?.recent_activity?.length) {
            return dataAppointmentDashboard.recent_activity;
        }

        return buildRecentFallback(dataAppointments);
    }, [dataAppointmentDashboard?.recent_activity, dataAppointments]);

    const monthlyGoal = dataAppointmentDashboard?.summary?.monthlyGoal ?? 50;
    const totalProgress = monthlyGoal > 0 ? (totalAppointments / monthlyGoal) * 100 : 0;
    const completedRate =
        totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const pendingRate =
        totalAppointments > 0 ? (pendingAppointments / totalAppointments) * 100 : 0;
    const canceledRate =
        totalAppointments > 0 ? (canceledAppointments / totalAppointments) * 100 : 0;

    const summaryIsReal = dataAppointmentDashboard?.data_flags?.summary ?? false;
    const monthlyIsReal =
        dataAppointmentDashboard?.data_flags?.monthly ??
        Boolean(dataAppointmentDashboard?.monthly_trend?.length);
    const statusIsReal =
        dataAppointmentDashboard?.data_flags?.statusDistribution ??
        Boolean(dataStatsAppointmentCount);
    const rankingIsReal =
        dataAppointmentDashboard?.data_flags?.ranking ??
        Boolean(dataStatsAppointment?.length);
    const recentIsReal =
        dataAppointmentDashboard?.data_flags?.recentActivity ??
        Boolean(dataAppointmentDashboard?.recent_activity?.length);

    const isLoading =
        isLoadingAppointments ||
        isLoadingStatsAppointment ||
        isLoadingStatsAppointmentCount ||
        isLoadingAppointmentDashboard;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-[28px] bg-white px-6 py-6 shadow-[0_16px_40px_rgba(62,92,163,0.12)] md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[34px] font-semibold tracking-[-0.03em] text-[#1F2A44]">
                        Estadisticas
                    </h1>
                    <p className="mt-1 text-[16px] text-[#60708A]">
                        Resumen de actividad y rendimiento del sistema
                    </p>
                </div>
            </div>

            {isLoading && (
                <div className="rounded-[24px] border border-white/70 bg-white p-6 text-[15px] text-[#60708A] shadow-[0_18px_45px_rgba(64,87,144,0.12)]">
                    Cargando estadisticas...
                </div>
            )}

            {!isLoading && (
                <>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <DashboardStatCard
                            title="Total de Citas"
                            value={totalAppointments}
                            accent="#4F7CF7"
                            softAccent="#EEF4FF"
                            progressValue={totalProgress}
                            progressLabelLeft="Meta mensual"
                            progressLabelRight={`${totalAppointments}/${monthlyGoal}`}
                            footerLabel={dataAppointmentDashboard?.summary?.totalTrendLabel ?? "backend pendiente"}
                            footerValue={dataAppointmentDashboard?.summary?.totalTrendValue ?? "data false"}
                            isRealData={summaryIsReal}
                        />

                        <DashboardStatCard
                            title="Completadas"
                            value={completedAppointments}
                            accent="#12B886"
                            softAccent="#EAFBF4"
                            progressValue={completedRate}
                            progressLabelLeft="Tasa de exito"
                            progressLabelRight={`${completedRate.toFixed(0)}%`}
                            footerLabel={dataAppointmentDashboard?.summary?.completedTrendLabel ?? "del total"}
                            footerValue={dataAppointmentDashboard?.summary?.completedTrendValue ?? `${completedAppointments}`}
                            isRealData={summaryIsReal}
                        />

                        <DashboardStatCard
                            title="Pendientes"
                            value={pendingAppointments}
                            accent="#F29B07"
                            softAccent="#FFF4DF"
                            progressValue={pendingRate}
                            progressLabelLeft="Del total"
                            progressLabelRight={`${pendingRate.toFixed(0)}%`}
                            footerLabel={dataAppointmentDashboard?.summary?.pendingTrendLabel ?? "seguimiento"}
                            footerValue={dataAppointmentDashboard?.summary?.pendingTrendValue ?? `${pendingAppointments}`}
                            isRealData={summaryIsReal}
                        />

                        <DashboardStatCard
                            title="Canceladas"
                            value={canceledAppointments}
                            accent="#F23F67"
                            softAccent="#FFF1F2"
                            progressValue={canceledRate}
                            progressLabelLeft="Tasa cancelacion"
                            progressLabelRight={`${canceledRate.toFixed(0)}%`}
                            footerLabel={dataAppointmentDashboard?.summary?.canceledTrendLabel ?? "backend pendiente"}
                            footerValue={dataAppointmentDashboard?.summary?.canceledTrendValue ?? "data false"}
                            isRealData={summaryIsReal && canceledAppointments > 0}
                        />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
                        <DashboardSectionCard
                            title="Citas por mes"
                            subtitle="Tendencia de creacion en los ultimos 6 meses"
                            badge={<DashboardDataBadge active={monthlyIsReal} />}
                        >
                            <DashboardTrendChart data={monthlyData} isRealData={monthlyIsReal} />
                        </DashboardSectionCard>

                        <DashboardSectionCard
                            title="Estado de citas"
                            subtitle="Distribucion actual"
                            badge={<DashboardDataBadge active={statusIsReal} />}
                        >
                            <DashboardStatusChart
                                completed={completedAppointments}
                                pending={pendingAppointments}
                                canceled={canceledAppointments}
                                total={totalAppointments}
                                isRealData={statusIsReal}
                            />
                        </DashboardSectionCard>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <DashboardSectionCard
                            title="Ranking por usuario"
                            subtitle="Citas registradas por cada miembro"
                            badge={<DashboardDataBadge active={rankingIsReal} />}
                        >
                            <DashboardRankingList items={rankingData} isRealData={rankingIsReal} />
                        </DashboardSectionCard>

                        <DashboardSectionCard
                            title="Actividad reciente"
                            subtitle="Ultimas acciones en el sistema"
                            badge={<DashboardDataBadge active={recentIsReal} />}
                        >
                            <DashboardRecentActivity
                                items={recentActivity}
                                isRealData={recentIsReal}
                            />
                        </DashboardSectionCard>
                    </div>
                </>
            )}
        </div>
    );
};
