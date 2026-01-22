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
