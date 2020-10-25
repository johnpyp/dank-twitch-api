import { UserFollowResponseData } from "../responses";
import Client from "../client";
import { omitWithoutFunctions } from "../util";
import { User } from "./user";

export interface UserFollowData {
  userId: string;
  userDisplayName: string;
  followingId: string;
  followingDisplayName: string;
  followedAtRaw: string;
  followedAt: Date;
}

export class UserFollow implements UserFollowData {
  public readonly userId: string;
  public readonly userDisplayName: string;
  public readonly followingId: string;
  public readonly followingDisplayName: string;
  public readonly followedAtRaw: string;
  public readonly followedAt: Date;

  private client: Client;

  public constructor(raw: UserFollowResponseData, client: Client) {
    this.userId = raw.from_id;
    this.userDisplayName = raw.from_name;
    this.followingId = raw.to_id;
    this.followingDisplayName = raw.to_name;
    this.followedAtRaw = raw.followed_at;
    this.followedAt = new Date(raw.followed_at);

    this.client = client;
  }

  getUser(): Promise<User> {
    return this.client.getUserById(this.userId);
  }

  getFollowingUser(): Promise<User> {
    return this.client.getUserById(this.followingId);
  }

  toJSON(): UserFollowData {
    return omitWithoutFunctions(this, ["client"]) as UserFollowData;
  }
  json(): UserFollowData {
    return this.toJSON();
  }
}
