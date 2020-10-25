/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/camelcase */
import got, { Got, Response } from "got";
import NodeCache from "node-cache";
import {
  GetAccessTokenResponse,
  UserResponseData,
  VideosResponseData,
  IterateResponse,
} from "./responses";
import User from "./user";

export interface IExpiryStore<T> {
  set: (key: string, data: T, expiry: number) => Promise<boolean>;
  get: (key: string) => Promise<T | undefined>;
  has: (key: string) => Promise<boolean>;
}

type ITokenExpiryStore = IExpiryStore<string>;

class TokenExpiryStore implements ITokenExpiryStore {
  private cache = new NodeCache();

  async set(key: string, data: string, expiry: number): Promise<boolean> {
    return this.cache.set(key, data, expiry);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }
}

export interface ClientConfiguration {
  clientId?: string;
  clientSecret?: string;
  oauthToken?: string;
  url?: string;
  tokenCache?: ITokenExpiryStore;
}

const buildDefaultConfiguration: () => ClientConfiguration = () => ({
  url: "https://api.twitch.tv/helix",
  clientId: "3yumzvi6r4wfycsk7vt1kbtto9s0n4",
  tokenCache: new TokenExpiryStore(),
});

export default class Client {
  public config: ClientConfiguration;

  public request: Got;

  constructor(config: ClientConfiguration = {}) {
    this.config = { ...buildDefaultConfiguration(), ...config };
    this.request = got.extend({
      prefixUrl: this.config.url,
      headers: {
        "Client-ID": this.config.clientId,
      },
      hooks: {
        beforeRequest: [
          async (options): Promise<void> => {
            const token = await this.getAccessToken();
            if (token) {
              // eslint-disable-next-line no-param-reassign
              options.headers.Authorization = `Bearer ${token}`;
            }
          },
        ],
        afterResponse: [
          async (response, retryWithMergedOptions): Promise<Response> => {
            if (response.statusCode === 401) {
              const updatedOptions = {
                headers: {
                  token: await this.renewAccessToken(),
                },
              };
              return retryWithMergedOptions(updatedOptions);
            }
            return response;
          },
        ],
      },
    });
  }

  private async getAccessToken(): Promise<string | null> {
    const token = await this.config.tokenCache.get("accessToken");
    return token ?? null;
  }

  private async renewAccessToken(): Promise<string> {
    if (!this.config.clientSecret) throw new Error("Client secret not present");
    const body: GetAccessTokenResponse = await got
      .post("https://id.twitch.tv/oauth2/token", {
        searchParams: {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "client_credentials",
        },
      })
      .json();
    console.log(body);
    this.config.tokenCache.set(
      "accessToken",
      body.access_token,
      body.expires_in
    );
    return body.access_token;
  }

  async getUser(username: string): Promise<User> {
    const body: { data: UserResponseData[] } = await this.request
      .get("users", { searchParams: { login: username } })
      .json();
    const first = body.data[0];
    return first ? new User(first, this) : null;
  }

  async userExists(username: string): Promise<boolean> {
    return (await this.getUser(username)) !== null;
  }

  async getUserById(id: string): Promise<User> {
    const body: { data: UserResponseData[] } = await this.request
      .get("users", { searchParams: { id } })
      .json();
    const first = body.data[0];
    return first ? new User(first, this) : null;
  }

  async userExistsById(id: string): Promise<boolean> {
    return (await this.getUserById(id)) !== null;
  }

  async getVideoById(id: string): Promise<VideosResponseData> {
    const body: IterateResponse<VideosResponseData> = await this.request
      .get("videos", { searchParams: { id } })
      .json();
    const first = body.data[0];
    return first ?? null;
  }
}