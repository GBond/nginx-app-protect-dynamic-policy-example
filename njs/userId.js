async function handleRequest(r){
    let friendlyIp;
    friendlyIp = r.variables["ip_flag"] == "friendly_IP" ? true : false;
    let agent = r.variables["http_user_agent"];
    let location;

    switch(agent){
            case "chrome":
            location = friendlyIp ? "default" : "medium";
            break;
        default:
            location = friendlyIp  ? "medium" : "strict";
            break;
    }

    // let reply = await r.subrequest("/"+location+"/"+r.uri)
    // r.return(reply.status, reply.responseBody);
    r.internalRedirect("/"+location+"/"+r.uri);
}


export default {
    handleRequest
}