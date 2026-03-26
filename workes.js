// Worker: fetches BrawlAPI data and allows CORS
export default {
  async fetch(req) {
    const url = new URL(req.url);
    let tag = url.searchParams.get("tag");

    if (!tag) return new Response(JSON.stringify({error:"Missing tag"}), {status:400, headers:{"Content-Type":"application/json"}});
    
    tag = tag.trim().toUpperCase().replace(/[^A-Z0-9]/g,''); // clean tag

    try {
      const playerRes = await fetch(`https://api.brawlapi.com/v1/players/%23${tag}`);
      const battleRes = await fetch(`https://api.brawlapi.com/v1/players/%23${tag}/battlelog`);

      const player = await playerRes.json();
      const battles = (await battleRes.json()).items || [];

      return new Response(JSON.stringify({player, battles}), {
        status: 200,
        headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
      });

    } catch(e) {
      return new Response(JSON.stringify({error:e.message}), {status:500, headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
    }
  }
}