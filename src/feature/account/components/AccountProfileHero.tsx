import type { TAccountProfile } from "@lib/types/account";

interface AccountProfileHeroProps {
  profile: TAccountProfile;
  stats: {
    my_appointments: number;
    completed: number;
    pending: number;
  };
  isRealData: boolean;
}

const formatJoinedAt = (value?: string | null) => {
  if (!value) return "Miembro reciente";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export const AccountProfileHero = ({
  profile,
  stats,
  isRealData,
}: AccountProfileHeroProps) => {
  const fullName = `${profile.first_name} ${profile.last_name}`.trim() || profile.username;
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? profile.username?.[0] ?? ""}`
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(64,87,144,0.12)]">
      <div className="relative h-[124px] bg-[radial-gradient(circle_at_top_left,#5D8BFF_0%,#6941FF_45%,#19C7A5_100%)]">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="px-7 pb-6">
        <div className="-mt-8 flex h-18 w-18 items-center justify-center rounded-[28px] border-4 border-white bg-[#5D6BFF] text-[36px] font-semibold text-white shadow-lg">
          {initials || "U"}
        </div>

        {!isRealData && (
          <span className="mt-4 inline-flex rounded-full bg-[#FFF1F2] px-3 py-1 text-[12px] font-semibold text-[#E11D48]">
            data false
          </span>
        )}

        <h2 className="mt-4 text-[22px] font-semibold text-[#1F2A44]">{fullName}</h2>
        <span className="mt-3 inline-flex rounded-full border border-[#BCD4FF] bg-[#EEF4FF] px-3 py-1 text-[13px] font-semibold text-[#3972FF]">
          {profile.role || "Administrador"}
        </span>

        <p className="mt-4 text-[15px] leading-7 text-[#60708A]">
          {profile.bio || "Actualiza tu perfil para mostrar una descripcion personal."}
        </p>

        <div className="mt-6 space-y-4 text-[15px] text-[#60708A]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F8FF] text-[#5D6BFF]">@</span>
            <span>{profile.email || "Sin correo registrado"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4DF] text-[#F29B07]">+</span>
            <span>{profile.city || "Ciudad no definida"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3972FF]">#</span>
            <span>Miembro desde {formatJoinedAt(profile.joined_at)}</span>
          </div>
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-[#E8EEF8] pt-5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#D8E1F0] bg-[#F8FBFF] px-3 py-1 text-[13px] font-semibold text-[#60708A]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-[18px] border border-[#E8EEF8]">
          <div className="border-r border-[#E8EEF8] px-4 py-4 text-center">
            <p className="text-[32px] font-semibold text-[#3972FF]">{stats.my_appointments}</p>
            <p className="text-[13px] text-[#8A97AD]">Mis citas</p>
          </div>
          <div className="border-r border-[#E8EEF8] px-4 py-4 text-center">
            <p className="text-[32px] font-semibold text-[#12B886]">{stats.completed}</p>
            <p className="text-[13px] text-[#8A97AD]">Completadas</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="text-[32px] font-semibold text-[#F29B07]">{stats.pending}</p>
            <p className="text-[13px] text-[#8A97AD]">Pendientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};
