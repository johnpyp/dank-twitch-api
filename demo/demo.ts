import Client from "../src/client";

const main = async (): Promise<void> => {
  const client = new Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    const user = await client.getUser("destiny");
    console.log("User", user.json());
    const followers = await user.getFollowers(2);
    console.log("Follower", followers[0].json());
    const followerUser = await followers[0].getUser();
    console.log("Follower user", followerUser.json());
    const videos = await user.getVideos(2);
    console.log("User videos", videos[0].json());
  } catch (error) {
    console.log("Error", error, error?.response?.body);
  }
};

main();
