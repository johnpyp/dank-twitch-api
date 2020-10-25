import Client from "../src/client";

it("client wurks", async () => {
  const client = new Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  try {
    const meme = await client.getUser("destiny");
    console.log(meme);
    expect(meme.raw).toStrictEqual("hello");
  } catch (error) {
    console.log("Error", error);
    // console.log(error.response.body);
  }
});
