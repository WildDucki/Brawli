export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const tag = url.searchParams.get("tag");

      if (!tag) {
        return new Response(JSON.stringify({ error: "Missing tag" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const cleanTag = tag.replace("#", "").toUpperCase();

      const playerUrl = `https://api.brawlapi.com/v1/players/%23${cleanTag}`;
      const battleUrl = `https://api.brawlapi.com/v1/players/%23${cleanTag}/battlelog`;

      const [pRes, bRes] = await Promise.all([
        fetch(playerUrl),
        fetch(battleUrl)
      ]);

      const player = await pRes.json();
      const battleData = await bRes.json();

      return new Response(JSON.stringify({
        player,
        battles: battleData.items || []
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        error: "Worker crashed",
        details: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};