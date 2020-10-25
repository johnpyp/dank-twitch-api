# Dank-Twitch-Api

A library for using the twitch helix api

example:

```ts
import Client from "dank-twitch-api";

const main = async (): Promise<void> => {
  const client = new Client({
    clientId: "my-client-id",
    clientSecret: "my-client-secret",
  });
  try {
    const user = await client.getUser("destiny");
    console.log(user);
    const followers = await user.getFollowers(200);
    console.log(followers);
  } catch (error) {
    console.log("Error", error, error?.response?.body);
  }
};

main();
```
