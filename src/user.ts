import _ from "lodash";
import { Got } from "got";
import {
  UserResponseData,
  UserFollowResponseData,
  VideosResponseData,
  Pagination,
} from "./responses";
import Client from "./client";

async function iterateApi<T>(
  request: Got,
  max: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
  path: string
): Promise<T[]> {
  let after: string;
  const allData: T[] = [];
  const first = Math.min(100, max);
  while (max < 0 || allData.length < max) {
    const searchParams = _.omitBy({ ...params, after, first }, _.isUndefined);
    const body: {
      data: T[];
      pagination: Pagination;
    } = await request.get(path, { searchParams }).json();
    allData.push(...body.data);
    after = body.pagination.cursor;
    if (body.data.length < first) {
      break;
    }
  }
  return max > 0 ? allData.slice(0, max) : allData;
}
export default class User {
  public id: string;

  public displayNameRaw: string;

  public displayName: string;

  public description: string;

  public type?: "staff" | "admin" | "global_mod";

  public broadcasterType?: "partner" | "affiliate";

  public profileImageUrl: string;

  public offlineImageUrl: string;

  public totalViewCount: number;

  private client: Client;

  constructor(res: UserResponseData, client: Client) {
    this.id = res.id;
    this.displayName = res.display_name;
    this.displayNameRaw = res.login;
    this.description = res.description;
    this.type = res.type === "" ? null : res.type;
    this.broadcasterType =
      res.broadcaster_type === "" ? null : res.broadcaster_type;

    this.profileImageUrl = res.profile_image_url;
    this.offlineImageUrl = res.offline_image_url;
    this.totalViewCount = res.view_count;

    this.client = client;
  }

  getFollowing(max = -1): Promise<UserFollowResponseData[]> {
    return iterateApi(
      this.client.request,
      max,
      {
        from_id: this.id,
      },
      "users/follows"
    );
  }

  async getFollowers(max = -1): Promise<UserFollowResponseData[]> {
    return iterateApi(
      this.client.request,
      max,
      {
        to_id: this.id,
      },
      "users/follows"
    );
  }

  async getVideos(
    max = -1,
    period = "all",
    sort = "time"
  ): Promise<VideosResponseData[]> {
    return iterateApi(
      this.client.request,
      max,
      { user_id: this.id, period, sort },
      "users/follows"
    );
  }

  toString(): string {
    return JSON.stringify({
      id: this.id,
      displayName: this.displayName,
      description: this.description,
      type: this.type,
      broadcasterType: this.broadcasterType,
      profileImageUrl: this.profileImageUrl,
      offlineImageUrl: this.offlineImageUrl,
      totalViewCount: this.totalViewCount,
    });
  }
}
