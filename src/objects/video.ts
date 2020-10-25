import { VideosResponseData } from "../responses";
import Client from "../client";
import { User } from "./user";
import { omitWithoutFunctions } from "../util";

export interface VideoData {
  id: string;
  userId: string;
  userDisplayName: string;
  title: string;
  description: string;
  createdAtRaw: string;
  publishedAtRaw: string;
  createdAt: Date;
  publishedAt: Date;
  url: string;
  thumbnailUrl: string;
  viewable: "public" | "private";
  viewCount: number;
  language: string;
  type: "upload" | "archive" | "highlight";
  duration: string;
}

export class Video implements VideoData {
  public readonly id: string;
  public readonly userId: string;
  public readonly userDisplayName: string;
  public readonly title: string;
  public readonly description: string;
  public readonly createdAtRaw: string;
  public readonly publishedAtRaw: string;
  public readonly createdAt: Date;
  public readonly publishedAt: Date;
  public readonly url: string;
  public readonly thumbnailUrl: string;
  public readonly viewable: "public" | "private";
  public readonly viewCount: number;
  public readonly language: string;
  public readonly type: "upload" | "archive" | "highlight";
  public readonly duration: string;

  private client: Client;

  constructor(raw: VideosResponseData, client: Client) {
    this.id = raw.id;
    this.userId = raw.user_id;
    this.userDisplayName = raw.user_name;
    this.title = raw.title;
    this.description = raw.description;
    this.createdAtRaw = raw.created_at;
    this.publishedAtRaw = raw.published_at;
    this.createdAt = new Date(raw.created_at);
    this.publishedAt = new Date(raw.published_at);
    this.url = raw.url;
    this.thumbnailUrl = raw.thumbnail_url;
    this.viewable = raw.viewable;
    this.viewCount = raw.view_count;
    this.language = raw.language;
    this.type = raw.type;
    this.duration = raw.duration;

    this.client = client;
  }

  public async getUser(): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.client.getUserById(this.userId).then((user) => user!);
  }

  public toJSON(): VideoData {
    return omitWithoutFunctions(this, ["client"]) as VideoData;
  }
  public json(): VideoData {
    return this.toJSON();
  }
}
