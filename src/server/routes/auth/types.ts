export type User = {
    id?: number;
    username?: string;
    email?: string;
    hashed_email?: string;
    password?: string;
    password_reset_token?: string | null;
    password_reset_expiry?: Date | null;
    verified?: boolean;
    created_at?: Date;
    updated_at?: Date;
    role?: 'Player'    // Largely read-only, and just for their own stuff.
    | 'Administrator'  // Can edit all resources within their game, e.g. sheets, equipment, notes.
    | 'Lead' ;         // Can additionally update the game's actual settings, e.g. house rules.
};

export type UserColumnNames = keyof User;
export type UserColumnsArray = UserColumnNames[];

export type PasswordResetCredentials = Pick<User, 
  'id' |
  'password_reset_token' |
  'password_reset_expiry'
>;

export type UserCredentials = Pick<User,
  'id' |
  'username' |
  'email' |
  'password' |
  'verified' |
  'role'
>;

export type CreatedUserResult = {
    id: number;
}
