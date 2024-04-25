export type Role = "client" | "coach" | "admin" | "";

export interface UserToRegister {
  role: Role;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userpic: FileList | undefined;
}

export interface LoginFormData {
  role: Role;
  email: string;
  password: string;
}

export type ThunkStatus = "idle" | "loading" | "succeeded" | "failed";

export type statusType = "normal" | "waiting" | "done" | "error" | "starting";
