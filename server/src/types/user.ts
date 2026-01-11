export interface UserRecord {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  username: string;
  created_at: Date;
}
