import { VideosResponseData } from "./responses";
import Client from "./client";
import User from "./user";

export default class Video {
  public id: string;

  public userId: string;

  public username: string;

  public title: string;

  public description: string;

  public createdAtRaw: string;

  public publishedAtRaw: string;

  public createdAt: Date;

  public publishedAt: Date;

  public url: string;

  public thumbnailUrl: string;

  public viewable: string;

  public viewCount: number;

  public language: string;

  public type: string;

  public duration: string;

  private client: Client;

  constructor(res: VideosResponseData, client: Client) {
    this.id = res.id;
    this.userId = res.user_id;
    this.username = res.user_name;
    this.title = res.title;
    this.description = res.description;
    this.createdAtRaw = res.created_at;
    this.publishedAtRaw = res.published_at;
    this.createdAt = new Date(res.created_at);
    this.publishedAt = new Date(res.published_at);
    this.url = res.url;
    this.thumbnailUrl = res.thumbnail_url;
    this.viewable = res.viewable;
    this.viewCount = res.view_count;
    this.language = res.language;
    this.type = res.type;
    this.duration = res.duration;

    this.client = client;
  }

  getUser(): Promise<User> {
    return this.client.getUserById(this.id);
  }
}
