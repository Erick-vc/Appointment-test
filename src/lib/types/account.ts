export type TAccountProfile = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  role: string;
  avatar_url?: string | null;
  joined_at?: string | null;
  skills?: string[];
};

export type TAccountProfileRequest = Pick<
  TAccountProfile,
  | "first_name"
  | "last_name"
  | "username"
  | "email"
  | "phone"
  | "city"
  | "bio"
>;

export type TAccountActivityItem = {
  id: string | number;
  type: "created" | "updated" | "completed" | "pending" | "deleted";
  title: string;
  subtitle?: string;
  created_at: string;
};

export type TAccountProfileResponse = {
  profile: TAccountProfile;
  stats: {
    my_appointments: number;
    completed: number;
    pending: number;
  };
  recent_activity: TAccountActivityItem[];
  data_flags?: {
    profile: boolean;
    stats: boolean;
    recent_activity: boolean;
  };
};

export type TAccountSettingsNotifications = {
  new_appointment: boolean;
  completed_appointment: boolean;
  pending_reminders: boolean;
  canceled_appointment: boolean;
  weekly_summary: boolean;
  email_enabled: boolean;
  product_updates: boolean;
};

export type TAccountSettingsAppearance = {
  dark_mode: boolean;
  accent_color: string;
  font_size: "small" | "normal" | "large";
  language: string;
};

export type TAccountSettingsSecurity = {
  two_factor_email: boolean;
  login_alerts: boolean;
};

export type TAccountSessionItem = {
  id: string | number;
  device: string;
  location: string;
  last_seen: string;
  is_current: boolean;
};

export type TAccountSettingsResponse = {
  notifications: TAccountSettingsNotifications;
  appearance: TAccountSettingsAppearance;
  security: TAccountSettingsSecurity;
  sessions: TAccountSessionItem[];
  data_flags?: {
    notifications: boolean;
    appearance: boolean;
    security: boolean;
    sessions: boolean;
  };
};

export type TAccountSettingsRequest = Pick<
  TAccountSettingsResponse,
  "notifications" | "appearance" | "security"
>;

export type TChangePasswordRequest = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
