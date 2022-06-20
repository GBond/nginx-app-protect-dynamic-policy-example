async function handleRequest(r){
    let friendlyIp;
    friendlyIp = r.variables["ip_flag"] == "friendly_IP" ? true : false;
    let agent = r.variables["http_user_agent"];
    let location;
    r.log("event is firing")

    switch(agent){
            case "chrome":
            location = friendlyIp ? "default" : "medium";
            r.log("executing chrome example")
            break;
        default:
            location = friendlyIp  ? "medium" : "strict";
            r.log("executing non-chrome example")
            break;
    }

    // let reply = await r.subrequest("/"+location+"/"+r.uri)
    // r.return(reply.status, reply.responseBody);
    r.internalRedirect("/"+location+"/"+r.uri);
}


export default {
    handleRequest
}