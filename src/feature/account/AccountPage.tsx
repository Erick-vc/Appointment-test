import { TitleHeader } from "@components/TitleHeader";
import { Button } from "@components/ui/Button";
import Input from "@components/ui/Input";
import Select from "@components/ui/Select";
import { TextArea } from "@components/ui/TextArea";
import { useMutationLogin } from "@lib/services/loginService";
import { useGetAppointment } from "@lib/services/appointmentService";
import {
  useGetAccountProfile,
  useGetAccountSettings,
  useMutationAccountProfile,
  useMutationAccountSettings,
} from "@lib/services/accountService";
import { useToastStore } from "@lib/stores/toastStore";
import { userStore } from "@lib/stores/userStore";
import type {
  TAccountActivityItem,
  TAccountProfile,
  TAccountProfileRequest,
  TAccountSessionItem,
  TAccountSettingsAppearance,
  TAccountSettingsNotifications,
  TAccountSettingsSecurity,
} from "@lib/types/account";
import type { TAppointmentResponse } from "@lib/types/appointment";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { AccountProfileHero } from "./components/AccountProfileHero";
import { AccountRecentActivity } from "./components/AccountRecentActivity";
import { AccountSectionCard } from "./components/AccountSectionCard";
import { AccountToggle } from "./components/AccountToggle";

type MainTab = "profile" | "settings";
type SettingsTab = "notifications" | "appearance" | "security" | "sessions" | "account";

const SETTINGS_NAV: { id: SettingsTab; label: string; icon: string }[] = [
  { id: "notifications", label: "Notificaciones", icon: "N" },
  { id: "appearance", label: "Apariencia", icon: "A" },
  { id: "security", label: "Seguridad", icon: "S" },
  { id: "sessions", label: "Sesiones", icon: "SE" },
  { id: "account", label: "Cuenta", icon: "C" },
];

const COLOR_OPTIONS = ["#3972FF", "#6941FF", "#18B889", "#F23F67", "#F29B07", "#1F2A44"];

const fallbackProfile = (userId: number, username: string): TAccountProfile => ({
  id: userId,
  username,
  first_name: username ? username[0].toUpperCase() + username.slice(1) : "Usuario",
  last_name: "",
  email: "",
  phone: "",
  city: "Lima, Peru",
  bio: "Gestiona tu informacion personal y completa tu perfil desde el backend.",
  role: "Administrador",
  joined_at: null,
  skills: ["Admin", "React", "Node.js"],
});

const fallbackActivity = (appointments: TAppointmentResponse[], userId: number): TAccountActivityItem[] =>
  appointments
    .filter((item) => item.owner === userId)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
    .map((appointment) => {
      const type = appointment.status === "done" ? "completed" : appointment.updated_at !== appointment.created_at ? "updated" : "created";
      return {
        id: appointment.id,
        type,
        title: type === "completed" ? `Marcaste como completada "${appointment.name}"` : type === "updated" ? `Editaste la cita "${appointment.name}"` : `Creaste la cita "${appointment.name}"`,
        subtitle: appointment.description,
        created_at: appointment.updated_at || appointment.created_at,
      };
    });

const fallbackNotifications = (email: string): TAccountSettingsNotifications => ({
  new_appointment: true,
  completed_appointment: true,
  pending_reminders: true,
  canceled_appointment: true,
  weekly_summary: true,
  email_enabled: Boolean(email),
  product_updates: false,
});

const fallbackAppearance = (): TAccountSettingsAppearance => ({
  dark_mode: false,
  accent_color: "#18B889",
  font_size: "normal",
  language: "es",
});

const fallbackSecurity = (): TAccountSettingsSecurity => ({
  two_factor_email: false,
  login_alerts: true,
});

const fallbackSessions = (): TAccountSessionItem[] => [
  { id: "current", device: "Chrome · Windows 11", location: "Lima, PE", last_seen: "Activo ahora", is_current: true },
  { id: "android", device: "Chrome · Android", location: "Lima, PE", last_seen: "Hace 2 horas", is_current: false },
  { id: "firefox", device: "Firefox · Windows 10", location: "Lima, PE", last_seen: "Hace 3 dias", is_current: false },
];

const DataBadge = ({ active }: { active: boolean }) => (
  !active ? <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-[12px] font-semibold text-[#E11D48]">data false</span> : null
);

export const AccountPage = () => {
  const { user_id, username } = userStore();
  const { showToast } = useToastStore();
  const { logoutMutate, isLoadingLogout } = useMutationLogin();
  const { dataAppointments = [] } = useGetAppointment();
  const { dataAccountProfile, isLoadingAccountProfile } = useGetAccountProfile();
  const { dataAccountSettings, isLoadingAccountSettings } = useGetAccountSettings();
  const { updateAccountProfileMutate, isLoadingUpdateAccountProfile } = useMutationAccountProfile();
  const {
    updateAccountSettingsMutate,
    isLoadingUpdateAccountSettings,
    changeAccountPasswordMutate,
    isLoadingChangeAccountPassword,
    closeOtherSessionsMutate,
    isLoadingCloseOtherSessions,
    exportAccountDataMutate,
    isLoadingExportAccountData,
    deactivateAccountMutate,
    isLoadingDeactivateAccount,
    deleteAccountMutate,
    isLoadingDeleteAccount,
  } = useMutationAccountSettings();

  const [mainTab, setMainTab] = useState<MainTab>("profile");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("notifications");
  const profile = useMemo(() => dataAccountProfile?.profile ?? fallbackProfile(user_id, username), [dataAccountProfile?.profile, user_id, username]);
  const stats = useMemo(() => {
    if (dataAccountProfile?.stats) return dataAccountProfile.stats;
    const mine = dataAppointments.filter((item) => item.owner === user_id);
    return {
      my_appointments: mine.length,
      completed: mine.filter((item) => item.status === "done").length,
      pending: mine.filter((item) => item.status === "pending" || item.status === "in_progress").length,
    };
  }, [dataAccountProfile?.stats, dataAppointments, user_id]);
  const recentActivity = useMemo(() => dataAccountProfile?.recent_activity?.length ? dataAccountProfile.recent_activity : fallbackActivity(dataAppointments, user_id), [dataAccountProfile?.recent_activity, dataAppointments, user_id]);

  const [profileForm, setProfileForm] = useState<TAccountProfileRequest>({ first_name: "", last_name: "", username: "", email: "", phone: "", city: "", bio: "" });
  const [notifications, setNotifications] = useState<TAccountSettingsNotifications>(fallbackNotifications(""));
  const [appearance, setAppearance] = useState<TAccountSettingsAppearance>(fallbackAppearance());
  const [security, setSecurity] = useState<TAccountSettingsSecurity>(fallbackSecurity());
  const [sessions, setSessions] = useState<TAccountSessionItem[]>(fallbackSessions());
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });

  useEffect(() => {
    setProfileForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      username: profile.username ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  useEffect(() => {
    setNotifications(dataAccountSettings?.notifications ?? fallbackNotifications(profile.email));
    setAppearance(dataAccountSettings?.appearance ?? fallbackAppearance());
    setSecurity(dataAccountSettings?.security ?? fallbackSecurity());
    setSessions(dataAccountSettings?.sessions ?? fallbackSessions());
  }, [dataAccountSettings, profile.email]);

  const isLoading = isLoadingAccountProfile || isLoadingAccountSettings;
  const profileReal = dataAccountProfile?.data_flags?.profile ?? false;
  const activityReal = dataAccountProfile?.data_flags?.recent_activity ?? Boolean(dataAccountProfile?.recent_activity?.length);
  const flags = dataAccountSettings?.data_flags ?? { notifications: false, appearance: false, security: false, sessions: false };

  const profileChange = (field: keyof TAccountProfileRequest) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
  const passwordChange = (field: keyof typeof passwordForm) => (event: ChangeEvent<HTMLInputElement>) => setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }));
  const saveLocalToast = (message: string) => showToast({ iconType: "warning", message });

  const saveSettings = (successMessage: string) => {
    if (!dataAccountSettings) return saveLocalToast("Configuracion guardada localmente. Backend pendiente.");
    updateAccountSettingsMutate({ notifications, appearance, security }, {
      onSuccess: () => showToast({ iconType: "success", message: successMessage }),
      onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo guardar la configuracion" }),
    });
  };

  const renderProfile = () => (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.38fr]">
      <AccountProfileHero profile={profile} stats={stats} isRealData={profileReal} />
      <div className="flex flex-col gap-6">
        <AccountSectionCard title="Informacion personal" subtitle="Actualiza tus datos de perfil">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Nombre", "first_name"], ["Apellido", "last_name"], ["Nombre de usuario", "username"], ["Telefono", "phone"], ["Ciudad", "city"],
            ].map(([label, field]) => (
              <div key={field}>
                <p className="mb-2 text-[14px] font-semibold text-[#60708A]">{label}</p>
                <Input value={profileForm[field as keyof TAccountProfileRequest] as string} onChange={profileChange(field as keyof TAccountProfileRequest)} className="w-full" inputClassName="h-[42px]" prefix={field === "username" ? <span className="text-[#94A3B8]">@</span> : undefined} />
              </div>
            ))}
            <div>
              <p className="mb-2 text-[14px] font-semibold text-[#60708A]">Rol</p>
              <Input value={profile.role} disabled className="w-full" inputClassName="h-[42px]" />
            </div>
            <div className="md:col-span-2">
              <p className="mb-2 text-[14px] font-semibold text-[#60708A]">Correo electronico</p>
              <Input type="email" value={profileForm.email} onChange={profileChange("email")} className="w-full" inputClassName="h-[42px]" />
            </div>
            <div className="md:col-span-2">
              <p className="mb-2 text-[14px] font-semibold text-[#60708A]">Biografia</p>
              <TextArea value={profileForm.bio} onChange={profileChange("bio")} className="w-full" rows={4} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button outlined variant="default" className="rounded-[14px] px-6 py-2.5" onClick={() => setProfileForm({ first_name: profile.first_name ?? "", last_name: profile.last_name ?? "", username: profile.username ?? "", email: profile.email ?? "", phone: profile.phone ?? "", city: profile.city ?? "", bio: profile.bio ?? "" })}>Cancelar</Button>
            <Button filled variant="primary" className="rounded-[14px] px-6 py-2.5" loading={isLoadingUpdateAccountProfile} onClick={() => updateAccountProfileMutate(profileForm, { onSuccess: () => showToast({ iconType: "success", message: "Perfil actualizado correctamente" }), onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo actualizar el perfil" }) })}>Guardar cambios</Button>
          </div>
        </AccountSectionCard>
        <AccountSectionCard title="Mi actividad reciente" subtitle="Historial de tus ultimas acciones">
          <AccountRecentActivity items={recentActivity} isRealData={activityReal} />
        </AccountSectionCard>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <aside className="rounded-[24px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(64,87,144,0.12)]">
        {SETTINGS_NAV.map((item) => (
          <button key={item.id} type="button" onClick={() => setSettingsTab(item.id)} className={`flex w-full items-center gap-4 border-b border-[#E8EEF8] px-5 py-5 text-left last:border-b-0 ${settingsTab === item.id ? "border-l-4 border-l-[#3972FF] bg-[#EEF4FF] text-[#3972FF]" : "text-[#60708A]"}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5F8FF] text-[12px] font-bold text-[#3972FF]">{item.icon}</span>
            <span className="text-[16px] font-semibold">{item.label}</span>
          </button>
        ))}
      </aside>
      <div className="flex flex-col gap-5">
        {settingsTab === "notifications" && (
          <>
            <AccountSectionCard title="Notificaciones del sistema" subtitle="Controla que avisos recibes" actions={<DataBadge active={flags.notifications} />}>
              <div className="space-y-5">
                {[
                  ["new_appointment", "Nueva cita creada", "Recibir alerta cuando se registre una nueva cita"],
                  ["completed_appointment", "Cita completada", "Notificar cuando una cita cambie a estado completado"],
                  ["pending_reminders", "Recordatorios de pendientes", "Recibir recordatorio diario de citas sin resolver"],
                  ["canceled_appointment", "Cita cancelada", "Alerta cuando una cita sea cancelada"],
                  ["weekly_summary", "Resumen semanal", "Recibir reporte de actividad cada lunes"],
                ].map(([key, title, desc]) => (
                  <div key={String(key)} className="flex items-center justify-between gap-4 border-b border-[#E8EEF8] pb-5 last:border-b-0 last:pb-0">
                    <div><p className="text-[16px] font-semibold text-[#1F2A44]">{title}</p><p className="mt-1 text-[14px] text-[#60708A]">{desc}</p></div>
                    <AccountToggle checked={notifications[key as keyof TAccountSettingsNotifications] as boolean} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof TAccountSettingsNotifications] }))} />
                  </div>
                ))}
              </div>
            </AccountSectionCard>
            <AccountSectionCard title="Notificaciones por email" subtitle="Configura las alertas a tu correo">
              <div className="space-y-5">
                {[["email_enabled", "Emails habilitados", profile.email || "Sin correo configurado"], ["product_updates", "Boletin de novedades", "Actualizaciones del producto y nuevas funciones"]].map(([key, title, desc]) => (
                  <div key={String(key)} className="flex items-center justify-between gap-4 border-b border-[#E8EEF8] pb-5 last:border-b-0 last:pb-0">
                    <div><p className="text-[16px] font-semibold text-[#1F2A44]">{title}</p><p className="mt-1 text-[14px] text-[#60708A]">{desc}</p></div>
                    <AccountToggle checked={notifications[key as keyof TAccountSettingsNotifications] as boolean} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof TAccountSettingsNotifications] }))} />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end"><Button filled variant="primary" className="rounded-[14px] px-6 py-2.5" loading={isLoadingUpdateAccountSettings} onClick={() => saveSettings("Preferencias actualizadas correctamente")}>Guardar preferencias</Button></div>
            </AccountSectionCard>
          </>
        )}
        {settingsTab === "appearance" && (
          <AccountSectionCard title="Tema de la aplicacion" subtitle="Personaliza el aspecto visual" actions={<DataBadge active={flags.appearance} />}>
            <div className="flex items-center justify-between gap-4 border-b border-[#E8EEF8] pb-5">
              <div><p className="text-[16px] font-semibold text-[#1F2A44]">Modo oscuro</p><p className="mt-1 text-[14px] text-[#60708A]">Cambiar entre tema claro y oscuro</p></div>
              <AccountToggle checked={appearance.dark_mode} onChange={(value) => setAppearance((prev) => ({ ...prev, dark_mode: value }))} />
            </div>
            <div className="mt-5"><p className="text-[16px] font-semibold text-[#60708A]">Color de acento</p><div className="mt-4 flex flex-wrap gap-3">{COLOR_OPTIONS.map((color) => <button key={color} type="button" onClick={() => setAppearance((prev) => ({ ...prev, accent_color: color }))} className={`h-10 w-10 rounded-[12px] border-2 ${appearance.accent_color === color ? "border-white shadow-[0_0_0_2px_rgba(57,114,255,0.45)]" : "border-transparent"}`} style={{ backgroundColor: color }} />)}</div></div>
            <div className="mt-5 grid gap-5 md:max-w-[260px]">
              <div><p className="mb-2 text-[14px] font-semibold text-[#60708A]">Tamano de fuente</p><Select value={appearance.font_size} onChange={(value) => setAppearance((prev) => ({ ...prev, font_size: String(value) as TAccountSettingsAppearance["font_size"] }))} searchable={false} options={[{ id: "small", label: "Pequena (12px)" }, { id: "normal", label: "Normal (14px)" }, { id: "large", label: "Grande (16px)" }]} /></div>
              <div><p className="mb-2 text-[14px] font-semibold text-[#60708A]">Idioma</p><Select value={appearance.language} onChange={(value) => setAppearance((prev) => ({ ...prev, language: String(value) }))} searchable={false} options={[{ id: "es", label: "Es Espanol" }, { id: "en", label: "English" }]} /></div>
            </div>
            <div className="mt-6 flex justify-end"><Button filled variant="primary" className="rounded-[14px] px-6 py-2.5" loading={isLoadingUpdateAccountSettings} onClick={() => saveSettings("Apariencia actualizada correctamente")}>Aplicar cambios</Button></div>
          </AccountSectionCard>
        )}
        {settingsTab === "security" && (
          <>
            <AccountSectionCard title="Cambiar contrasena" subtitle="Usa una contrasena fuerte de al menos 8 caracteres">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2"><p className="mb-2 text-[14px] font-semibold text-[#60708A]">Contrasena actual</p><Input type="password" value={passwordForm.current_password} onChange={passwordChange("current_password")} className="w-full" inputClassName="h-[42px]" /></div>
                <div><p className="mb-2 text-[14px] font-semibold text-[#60708A]">Nueva contrasena</p><Input type="password" value={passwordForm.new_password} onChange={passwordChange("new_password")} className="w-full" inputClassName="h-[42px]" /></div>
                <div><p className="mb-2 text-[14px] font-semibold text-[#60708A]">Confirmar contrasena</p><Input type="password" value={passwordForm.confirm_password} onChange={passwordChange("confirm_password")} className="w-full" inputClassName="h-[42px]" /></div>
              </div>
              <div className="mt-6 flex justify-end"><Button filled variant="primary" className="rounded-[14px] px-6 py-2.5" loading={isLoadingChangeAccountPassword} onClick={() => {
                if (passwordForm.new_password !== passwordForm.confirm_password) return showToast({ iconType: "error", message: "La confirmacion de contrasena no coincide" });
                changeAccountPasswordMutate(passwordForm, {
                  onSuccess: () => { setPasswordForm({ current_password: "", new_password: "", confirm_password: "" }); showToast({ iconType: "success", message: "Contrasena actualizada correctamente" }); },
                  onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo actualizar la contrasena" }),
                });
              }}>Actualizar contrasena</Button></div>
            </AccountSectionCard>
            <AccountSectionCard title="Autenticacion de dos factores" subtitle="Anade una capa extra de seguridad a tu cuenta" actions={<DataBadge active={flags.security} />}>
              <div className="space-y-5">
                {[["two_factor_email", "2FA por email", "Codigo de verificacion en cada inicio de sesion"], ["login_alerts", "Alertas de inicio de sesion", "Notificar cuando se inicie sesion desde un nuevo dispositivo"]].map(([key, title, desc]) => (
                  <div key={String(key)} className="flex items-center justify-between gap-4 border-b border-[#E8EEF8] pb-5 last:border-b-0 last:pb-0">
                    <div><p className="text-[16px] font-semibold text-[#1F2A44]">{title}</p><p className="mt-1 text-[14px] text-[#60708A]">{desc}</p></div>
                    <AccountToggle checked={security[key as keyof TAccountSettingsSecurity]} onChange={() => setSecurity((prev) => ({ ...prev, [key]: !prev[key as keyof TAccountSettingsSecurity] }))} />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end"><Button filled variant="primary" className="rounded-[14px] px-6 py-2.5" loading={isLoadingUpdateAccountSettings} onClick={() => saveSettings("Seguridad actualizada correctamente")}>Guardar seguridad</Button></div>
            </AccountSectionCard>
          </>
        )}
        {settingsTab === "sessions" && (
          <AccountSectionCard title="Sesiones activas" subtitle="Dispositivos con sesion iniciada en tu cuenta" actions={<DataBadge active={flags.sessions} />}>
            <div className="space-y-5">{sessions.map((session) => <div key={session.id} className="flex items-center justify-between gap-4 border-b border-[#E8EEF8] pb-5 last:border-b-0 last:pb-0"><div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F8FF] text-[#3972FF]">{session.is_current ? "PC" : "M"}</div><div><p className="text-[16px] font-semibold text-[#1F2A44]">{session.device}</p><p className="mt-1 text-[14px] text-[#94A3B8]">{session.location} · {session.last_seen}</p></div></div><span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${session.is_current ? "bg-[#EAFBF4] text-[#12B886]" : "bg-[#EEF3FB] text-[#94A3B8]"}`}>{session.is_current ? "Sesion actual" : "Otro"}</span></div>)}</div>
            <div className="mt-6 flex justify-end"><Button outlined variant="danger" className="rounded-[14px] px-6 py-2.5" loading={isLoadingCloseOtherSessions} onClick={() => {
              if (!dataAccountSettings) { setSessions((prev) => prev.filter((item) => item.is_current)); return saveLocalToast("Sesiones cerradas localmente. Backend pendiente."); }
              closeOtherSessionsMutate(undefined, { onSuccess: () => showToast({ iconType: "success", message: "Otras sesiones cerradas correctamente" }), onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudieron cerrar las otras sesiones" }) });
            }}>Cerrar otras sesiones</Button></div>
          </AccountSectionCard>
        )}
        {settingsTab === "account" && (
          <>
            <AccountSectionCard title="Exportar mis datos" subtitle="Descarga toda tu informacion del sistema">
              <p className="max-w-[760px] text-[16px] leading-7 text-[#60708A]">Puedes solicitar una exportacion de todos tus datos: citas, actividad y configuracion. El archivo se genera en formato JSON.</p>
              <div className="mt-6"><Button outlined variant="default" className="rounded-[14px] px-6 py-2.5" loading={isLoadingExportAccountData} onClick={() => {
                if (!dataAccountSettings) return saveLocalToast("Exportacion simulada. Backend pendiente.");
                exportAccountDataMutate(undefined, { onSuccess: () => showToast({ iconType: "success", message: "Solicitud de exportacion enviada" }), onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo solicitar la exportacion" }) });
              }}>Solicitar exportacion</Button></div>
            </AccountSectionCard>
            <section className="rounded-[24px] border border-[#F6A8B8] bg-[#FFF1F4] p-6 shadow-[0_18px_45px_rgba(64,87,144,0.08)]">
              <h3 className="text-[24px] font-semibold text-[#F23F67]">Zona de peligro</h3>
              <p className="mt-2 max-w-[760px] text-[16px] leading-7 text-[#60708A]">Estas acciones son irreversibles. Procede con cuidado. Eliminar tu cuenta borrara todos tus datos, citas y configuraciones permanentemente.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button outlined variant="danger" className="rounded-[14px] px-6 py-2.5" loading={isLoadingDeactivateAccount} onClick={() => {
                  if (!dataAccountSettings) return saveLocalToast("Accion simulada. Backend pendiente.");
                  deactivateAccountMutate(undefined, { onSuccess: () => showToast({ iconType: "success", message: "Cuenta desactivada correctamente" }), onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo desactivar la cuenta" }) });
                }}>Desactivar cuenta</Button>
                <Button outlined variant="danger" className="rounded-[14px] px-6 py-2.5" loading={isLoadingDeleteAccount} onClick={() => {
                  if (!dataAccountSettings) return saveLocalToast("Accion simulada. Backend pendiente.");
                  deleteAccountMutate(undefined, { onSuccess: () => showToast({ iconType: "success", message: "Cuenta eliminada correctamente" }), onError: (error: Error) => showToast({ iconType: "error", message: error.message || "No se pudo eliminar la cuenta" }) });
                }}>Eliminar cuenta</Button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 rounded-[28px] bg-white px-6 py-6 shadow-[0_16px_40px_rgba(62,92,163,0.12)]">
        <TitleHeader title={mainTab === "profile" ? "Perfil" : "Configuracion"} subTitle={mainTab === "profile" ? "Gestiona tu informacion personal" : "Personaliza la aplicacion a tu gusto"} fontSizeTitle="text-[34px] leading-[34px]" />
        <Button outlined variant="danger" className="rounded-[14px] px-5 py-2.5" loading={isLoadingLogout} onClick={() => logoutMutate()}>Salir</Button>
      </div>
      <div className="flex gap-8 border-b border-[#DCE6F5] bg-white px-6 py-4 text-[16px] font-semibold text-[#60708A] shadow-[0_10px_24px_rgba(64,87,144,0.06)]">
        <button type="button" onClick={() => setMainTab("profile")} className={`pb-3 ${mainTab === "profile" ? "border-b-2 border-[#3972FF] text-[#3972FF]" : "text-[#94A3B8]"}`}>Perfil</button>
        <button type="button" onClick={() => setMainTab("settings")} className={`pb-3 ${mainTab === "settings" ? "border-b-2 border-[#3972FF] text-[#3972FF]" : "text-[#94A3B8]"}`}>Configuracion</button>
      </div>
      {isLoading ? <div className="rounded-[24px] border border-white/70 bg-white p-6 text-[15px] text-[#60708A] shadow-[0_18px_45px_rgba(64,87,144,0.12)]">Cargando informacion...</div> : mainTab === "profile" ? renderProfile() : renderSettings()}
    </div>
  );
};
