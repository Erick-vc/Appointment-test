import { ResponsivePie } from "@nivo/pie";

interface DashboardStatusChartProps {
  completed: number;
  pending: number;
  canceled: number;
  total: number;
  isRealData: boolean;
}

export const DashboardStatusChart = ({
  completed,
  pending,
  canceled,
  total,
  isRealData,
}: DashboardStatusChartProps) => {
  const chartData = [
    { id: "Completadas", label: "Completadas", value: completed, color: "#18B889" },
    { id: "Pendientes", label: "Pendientes", value: pending, color: "#F29B07" },
    { id: "Canceladas", label: "Canceladas", value: canceled, color: "#F23F67" },
  ].filter((item) => item.value > 0);

  return (
    <div>
      {!isRealData && (
        <p className="mb-4 text-[13px] text-[#E11D48]">
          La distribuci&oacute;n completa requiere backend.
        </p>
      )}

      <div className="relative h-[280px]">
        <ResponsivePie
          data={chartData.length > 0 ? chartData : [{ id: "Sin datos", label: "Sin datos", value: 1, color: "#CBD5E1" }]}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.7}
          padAngle={1}
          cornerRadius={4}
          activeOuterRadiusOffset={6}
          enableArcLinkLabels={false}
          colors={(item) => item.data.color}
          enableArcLabels={false}
          tooltip={({ datum }) => (
            <div className="rounded-[12px] bg-[#2C2F36] px-3 py-2 text-white shadow-[0_10px_24px_rgba(15,23,42,0.35)]">
              <p className="mb-2 text-[14px] font-semibold">{String(datum.label)}</p>
              <div className="flex items-center gap-2 text-[12px] font-medium">
                <span
                  className="h-3.5 w-3.5 rounded-[2px] border-2 border-white"
                  style={{ backgroundColor: String(datum.color) }}
                />
                <span>
                  {String(datum.label)}: {datum.value} citas
                </span>
              </div>
            </div>
          )}
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] text-[#94A3B8]">total</span>
          <span className="text-[52px] font-semibold leading-none text-[#1F2A44]">
            {total}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-3">
        {[
          { label: "Completadas", value: completed, color: "#18B889" },
          { label: "Pendientes", value: pending, color: "#F29B07" },
          { label: "Canceladas", value: canceled, color: "#F23F67" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[14px] text-[#60708A]">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span>
              {item.label} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
