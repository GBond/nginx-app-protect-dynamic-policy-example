async function handleRequest(r){
    let friendlyIp;
    friendlyIp = r.variables["ip_flag"] == "friendly_IP" ? true : false;
    let agent = r.variables["http_user_agent"];
    let location;
    r.error("event is firing");

    r.error("U-A is: "+agent);

    r.error("friendIp is " + friendlyIp);
    r.error("IP Address: " + r.variables["remote_addr"]);

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

    r.error("Location: "+location+" where we are going.")

    // let reply = await r.subrequest("/"+location+"/"+r.uri)
    // r.return(reply.status, reply.responseBody);
    r.internalRedirect("/"+location+"/"+r.uri);
}


export default {
    handleRequest
}