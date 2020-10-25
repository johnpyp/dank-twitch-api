/* eslint-disable camelcase */
export interface UserResponseData {
  id: string;
  login: string;
  display_name: string;
  type: "staff" | "admin" | "global_mod" | "";
  broadcaster_type: "partner" | "affiliate" | "";
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
}

export interface GetAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string[];
  token_type: string;
}
export interface UserFollowResponseData {
  from_id: string;
  from_name: string;
  to_id: string;
  to_name: string;
  followed_at: string;
}

export interface VideosResponseData {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: "public" | "private";
  view_count: number;
  language: string;
  type: "upload" | "archive" | "highlight";
  duration: string;
}

export interface StreamResponseData {
  id: string;
  user_id: string;
  user_name: string;
  viewer_count: number;
  game_id: string;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: "live" | "";
}

export interface Pagination {
  cursor: string;
}

export interface IterateResponse<T> {
  data: T[];
  pagination: Pagination;
}
