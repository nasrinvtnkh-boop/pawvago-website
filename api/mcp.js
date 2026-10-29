"use strict";

// Public READ-ONLY MCP endpoint. No accounts, purchases or bookings.
// Same curated airline snapshot and logic used by the PawVago website.
const {listAirlines,screenCabin,policyDetails}=require("../lib/pawvago-policy.cjs");

module.exports=async function handler(req,res) {
  if (req.method==="OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin","https://chatgpt.com");
    res.setHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","content-type,accept,mcp-session-id,mcp-protocol-version");
    return res.status(204).end();
  }
  if (!["POST","GET","DELETE"].includes(req.method)) return res.status(405).end();
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Access-Control-Allow-Origin","https://chatgpt.com");
  res.setHeader("Access-Control-Expose-Headers","Mcp-Session-Id");

  let server,transport;
  try {
    const [{McpServer},{StreamableHTTPServerTransport},{z}]=await Promise.all([
      import("@modelcontextprotocol/sdk/server/mcp.js"),
      import("@modelcontextprotocol/sdk/server/streamableHttp.js"),
      import("zod")
    ]);
    server=new McpServer({name:"pawvago-travel-policy",version:"0.1.0"});
    const reply = obj=>({
      content:[{type:"text",text:JSON.stringify(obj)}],
      structuredContent:obj
    });
    server.registerTool("search_airlines",{
      title:"Search PawVago airline directory",
      description:"Look up airline names in PawVago's selected airline directory. Listings are not proof of live pet acceptance.",
      inputSchema:{query:z.string().max(120).optional()},
      annotations:{readOnlyHint:true,openWorldHint:false,destructiveHint:false}
    },async ({query})=>reply(listAirlines(query||"")));

    server.registerTool("get_airline_pet_policy",{
      title:"Get PawVago airline pet policy",
      description:"Read the last reviewed pet cabin and hold rules for one airline. Returns explicit unverified status when no reviewed policy exists; never claims availability.",
      inputSchema:{airline:z.string().min(1).max(120)},
      annotations:{readOnlyHint:true,openWorldHint:false,destructiveHint:false}
    },async ({airline})=>reply(policyDetails(airline)));

    server.registerTool("screen_pet_cabin",{
      title:"Screen a pet for preliminary cabin policy fit",
      description:"Compare pet+carrier weights with reviewed general airline cabin policies. Not a route/flight booking or safety/legal guarantee.",
      inputSchema:{
        airline:z.string().min(1).max(120),
        petWeightKg:z.number().positive().max(200),
        carrierWeightKg:z.number().min(0).max(100),
        breed:z.string().max(100).optional(),
        from:z.string().max(70).optional(),
        to:z.string().max(70).optional()
      },
      annotations:{readOnlyHint:true,openWorldHint:false,destructiveHint:false}
    },async args=>reply(screenCabin(args)));
    transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
    res.on("close",()=>{void transport.close();void server.close();});
    await server.connect(transport);
    await transport.handleRequest(req,res,req.body);
  } catch (err) {
    console.error("PawVago MCP request failed",err);
    if (!res.headersSent) res.status(500).json({error:"MCP endpoint error"});
  }
};
