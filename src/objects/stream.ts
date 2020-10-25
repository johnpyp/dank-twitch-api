import Client from "../client";
import { StreamResponseData } from "../responses";
import { fixEmptyStrings, omitWithoutFunctions } from "../util";
import { User } from "./user";

export interface StreamData {
  id: string;
  userId: string;
  userDisplayName: string;
  viewerCount: number;
  gameId: string;
  language: string;
  startedAt: string;
  tagIds: string[];
  thumbnailUrl: string;
  title: string;
  type: "live" | null;
}

export class Stream implements StreamData {
  public readonly id: string;
  public readonly userId: string;
  public readonly userDisplayName: string;
  public readonly viewerCount: number;
  public readonly gameId: string;
  public readonly language: string;
  public readonly startedAt: string;
  public readonly tagIds: string[];
  public readonly thumbnailUrl: string;
  public readonly title: string;
  public readonly type: "live" | null;

  private client: Client;

  constructor(raw: StreamResponseData, client: Client) {
    this.id = raw.id;
    this.userId = raw.user_id;
    this.userDisplayName = raw.user_name;
    this.viewerCount = raw.viewer_count;
    this.gameId = raw.game_id;
    this.language = raw.language;
    this.startedAt = raw.started_at;
    this.tagIds = raw.tag_ids;
    this.thumbnailUrl = raw.thumbnail_url;
    this.title = raw.title;
    this.type = fixEmptyStrings(raw.type);

    this.client = client;
  }

  public async getUser(): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.client.getUserById(this.userId).then((user) => user!);
  }

  public toJSON(): StreamData {
    return omitWithoutFunctions(this, ["client"]) as StreamData;
  }
  public json(): StreamData {
    return this.toJSON();
  }
}
