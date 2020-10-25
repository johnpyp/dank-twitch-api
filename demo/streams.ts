/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Client from "../src/client";

const main = async (): Promise<void> => {
  const client = new Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    const user = await client.getUser("destiny");
    const isLive = await user?.isLive();
    console.log(isLive);
  } catch (error) {
    console.log("Error", error, error?.response?.body);
  }
};

main();
