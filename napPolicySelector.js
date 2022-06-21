async function handleRequest(r) {
    let agent = r.variables["http_user_agent"];
    let policy_choice;

    r.error("U-A is: " + agent);

    r.variables["client_ip"] = "0.0.0.0";

    // get the XFF value
    let xff = r.headersIn["X-Forwarded-For"];

    r.error("ip_flag: " + r.variables["ip_flag"]);
    let allowedIp = r.variables["ip_flag"] == "allow" ? true : false;

    r.error("XFF: " + xff);
    r.error("Allow this IP? " + allowedIp);

    if (agent.toLowerCase().indexOf("chrome") > -1) {
        r.error("executing chrome example")
        policy_choice = allowedIp ? "medium" : "default";
    }
    else if (agent.toLowerCase().indexOf("curl") > -1) {
        r.error("executing curl example")
        policy_choice = allowedIp ? "medium" : "strict";
    } else {
        r.error("executing non-chrome example")
        policy_choice = allowedIp ? "medium" : "strict";
    }

    r.error("Policy Choice: " + policy_choice);

    r.internalRedirect("/" + policy_choice + "/" + r.uri);
}


export default {
    handleRequest
}