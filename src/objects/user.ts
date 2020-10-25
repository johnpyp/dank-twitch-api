import {
  UserResponseData,
  UserFollowResponseData,
  VideosResponseData,
  StreamResponseData,
} from "../responses";
import Client from "../client";
import {
  omitWithoutFunctions,
  iterateApi,
  transformRawDataMap,
  fixEmptyStrings,
} from "../util";
import { Video } from "./video";
import { UserFollow } from "./user-follow";
import { Stream } from "./stream";

export interface UserData {
  id: string;
  displayNameRaw: string;
  displayName: string;
  description: string;
  type: "staff" | "admin" | "global_mod" | null;
  broadcasterType: "partner" | "affiliate" | null;
  profileImageUrl: string;
  offlineImageUrl: string;
  totalViewCount: number;
}

export class User implements UserData {
  public id: string;
  public displayNameRaw: string;
  public displayName: string;
  public description: string;
  public type: "staff" | "admin" | "global_mod" | null;
  public broadcasterType: "partner" | "affiliate" | null;
  public profileImageUrl: string;
  public offlineImageUrl: string;
  public totalViewCount: number;

  private client: Client;

  constructor(raw: UserResponseData, client: Client) {
    this.id = raw.id;
    this.displayName = raw.display_name;
    this.displayNameRaw = raw.login;
    this.description = raw.description;
    this.type = fixEmptyStrings(raw.type);
    this.broadcasterType = fixEmptyStrings(raw.broadcaster_type);
    this.profileImageUrl = raw.profile_image_url;
    this.offlineImageUrl = raw.offline_image_url;
    this.totalViewCount = raw.view_count;

    this.client = client;
  }

  public async getFollowing(max = -1): Promise<UserFollow[]> {
    return iterateApi<UserFollowResponseData>(
      this.client.request,
      max,
      {
        from_id: this.id,
      },
      "users/follows"
    ).then(transformRawDataMap(UserFollow, this.client));
  }

  public async getFollowers(max = -1): Promise<UserFollow[]> {
    return iterateApi<UserFollowResponseData>(
      this.client.request,
      max,
      {
        to_id: this.id,
      },
      "users/follows"
    ).then(transformRawDataMap(UserFollow, this.client));
  }

  public async getVideos(
    max = -1,
    period: "all" | "day" | "week" | "month" = "all",
    sort: "time" | "trending" | "views" = "time"
  ): Promise<Video[]> {
    return iterateApi<VideosResponseData>(
      this.client.request,
      max,
      { user_id: this.id, period, sort },
      "videos"
    ).then(transformRawDataMap(Video, this.client));
  }

  public async getStream(): Promise<Stream | null> {
    const body: {
      data: StreamResponseData[];
    } = await this.client.request
      .get("streams", { searchParams: { user_id: this.id } })
      .json();
    const first = body.data[0];
    return first ? new Stream(first, this.client) : null;
  }

  public toJSON(): UserData {
    return omitWithoutFunctions(this, ["client"]) as UserData;
  }
  public json(): UserData {
    return this.toJSON();
  }
}
