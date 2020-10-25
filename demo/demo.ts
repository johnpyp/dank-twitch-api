import Client from "../src/client";

const main = async (): Promise<void> => {
  const client = new Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    const user = await client.getUser("destiny");
    console.log(user?.toString());
    const followers = await user.getFollowers(200);
    console.log(followers);
  } catch (error) {
    console.log("Error", error, error?.response?.body);
  }
};

main();
