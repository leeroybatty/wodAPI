import { Dispatch } from "react";

export type User = {
    id: number;
    name: string;
    email: string;
}

export enum ActionType {
    Login = "LOGIN",
    Logout = "LOGOUT",
    Verify = "VERIFY",
    Error = "ERROR",
    Loading = "LOADING",
    ViewProfile = "VIEW_PROFILE",
    UpdateProfile = "UPDATE_PROFILE",
}

export type LoginLoggerPayload = {
  user: User;
  source?: string;
};

export type LogoutLoggerPayload = {
  user: User;
  reason?: string;
};

export type ViewProfileLoggerPayload = {
  user: User;
  loading: boolean;
};

export type UpdateProfileLoggerPayload = {
  user: Partial<User>;
  changes: Partial<User>;
  loading: boolean;
};

export type ErrorLoggerPayload = {
  message: string;
  status?: number | string;
  stack?: string;
};

export type LoadingLoggerPayload = {
  process: ActionType;
};

export type UserAuthState = {
    user: User | null;
    isAuthenticated?: boolean;
    isLoading: boolean;
    authError: ErrorLoggerPayload | null;
};

export type VerifyLoggerPayload = {
  auth: Partial<UserAuthState>;
};

export type UserProfile = {
    username: string;
    email: string;
    role: "Member" | "Creator" | "Moderator";
    created_at: string;
};

export type UserAction =
    | { type: ActionType.Login; payload: LoginLoggerPayload }
    | { type: ActionType.Logout; payload: LogoutLoggerPayload }
    | { type: ActionType.Verify; payload: VerifyLoggerPayload }
    | { type: ActionType.Error; payload: ErrorLoggerPayload }
    | { type: ActionType.Loading; payload: LoadingLoggerPayload }
    | { type: ActionType.ViewProfile; payload: ViewProfileLoggerPayload }
    | { type: ActionType.UpdateProfile; payload: UpdateProfileLoggerPayload };

export type UserContextType = [
    UserAuthState,
    Dispatch<UserAction>,
    () => Promise<Partial<UserAuthState>>,
    (email: string, password: string) => Promise<void>,
    () => Promise<void>,
    () => Promise<UserProfile>,
];