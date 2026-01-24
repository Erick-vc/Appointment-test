export type TAppointment = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: TStatusAppointment;
  owner: number;
};

export type TAppointmentResponse = TAppointment;
export type TAppointmentRequest = Pick<
  TAppointment,
  "name" | "description" | "status" | "owner"
>;

export type TStatusAppointment = "pending" | "in_progress" | "done";

export type TStatsAppointment = {
  username: string;
  count: number;
};

export type TStatsAppointmentCount = {
  pending: number;
  in_progress: number;
  done: number;
};
