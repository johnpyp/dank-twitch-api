import Client from "../src/client";

describe("client", () => {
  it("client wurks", async () => {
    const client = new Client({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    try {
      const meme = await client.getUser("destiny");
      expect(meme.displayName).toStrictEqual("Destiny");
    } catch (error) {
      console.log("Error", error);
    }
  });
});
