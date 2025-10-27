export interface IUpdateUserPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ICreatePostPayload {
  content: string;
  sharedWith?: string[]; // Array of user IDs to share the post with
}