import { ConnInfo, serve } from "./deps.ts";

function isNetAddr(addr: Deno.Addr): addr is Deno.NetAddr {
  return Object.hasOwn(addr, "hostname");
}

const port = 8080;
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  console.log(`HTTP server listening on http://localhost:${port}`);
}

const handler = async (request: Request, conn: ConnInfo) => {
  const { href, origin, host, pathname, hash, search } = new URL(request.url);

  const readme = await Deno.readTextFile("./README.md");

  const { localAddr, remoteAddr } = conn;
  if (!isNetAddr(localAddr) || !isNetAddr(remoteAddr)) {
    throw new Error("not net addr");
  }
  // console.log(`${localAddr.hostname}:${localAddr.port}`);
  //console.log(`${remoteAddr.hostname}:${remoteAddr.port}`);

  return new Response(readme, {
    headers: {
      "x-local-addr": `${localAddr.hostname}:${localAddr.port}`,
      "x-remote-addr": `${remoteAddr.hostname}:${remoteAddr.port}`,
    },
  });
};
await serve(handler, { port });
