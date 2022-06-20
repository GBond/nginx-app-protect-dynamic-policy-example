async function handleRequest(r) {
    let friendlyIp;
    friendlyIp = r.variables["ip_flag"] == "friendly_IP" ? true : false;
    let agent = r.variables["http_user_agent"];
    let policy_choice;
    r.error("event is firing");

    r.error("U-A is: " + agent);

    r.error("friendIp is " + friendlyIp);
    r.error("IP Address: " + r.variables["remote_addr"]);

    switch (true) {
        case /chrome/.test(agent):
            r.log("executing chrome example")
            policy_choice = friendlyIp ? "default" : "medium";
            break;
        default:
            r.log("executing non-chrome example")
            policy_choice = friendlyIp ? "medium" : "strict";
            break;
    }

    r.error("Location: " + policy_choice + " where we are going.")

    // let reply = await r.subrequest("/"+location+"/"+r.uri)
    // r.return(reply.status, reply.responseBody);
    r.internalRedirect("/" + policy_choice + "/" + r.uri);
}


export default {
    handleRequest
}