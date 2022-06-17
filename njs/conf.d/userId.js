

function handleRequest(r){
    let friendlyIp;
    friendlyIp = r.variables["ip_flag"] == "friendly_IP"  ? true : false;
    let agent = r.variables["http_user_agent"];
    let location;

    switch(agent){
        case agent.match(/~AppleWebKit.*Version\/[1-4]..*Safari/)?.input:
            location = friendlyIp ? "default" : "medium";
            break;
        default:
            location = friendlyIp  ? "medium" : "strict";
            break;
    }

    r.subrequest("@"+location)
    .then(response => {
        r.headersOut = response.headers;
        r.return(response.status, response.arrayBuffer());
    });
}