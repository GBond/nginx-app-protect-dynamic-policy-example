# NGINX App Protect WAF Dynamic Policy Selection Example 

### Goal 
Demonstrate how NGINX Configuration can evaluate the client's user agent info and IP address and apply a NGINX App Protect policy dynamically.

### Approach 
Using NJS (nginx programmability via JavaScript) the client request can determine how to select the policy

### Configuration details 
This example builds on the previous example using nginx.conf map statements with NJS.

At the top of the nginx.conf, thw NJS module is loaded:

```nginx
    load_module modules/ngx_http_js_module.so;
```
Here the NGINX API is used to test the incoming IP Address, stored here in the X-Forwarded-For header.  You can also use $remote_addr for non-proxied requests.

```nginx
    keyval_zone zone=one:1m type=string state=/etc/nginx/one.keyval;
    keyval $http_x_forwarded_for $ip_flag zone=one; # Client address is the key,

```

Then in the nginx Server block, we initalize the client_ip:

```nginx
        set $client_ip "";

```

Add set up a Location of "root" where the NJS will be called:
```nginx
        location / {
            app_protect_enable off;
            app_protect_security_log_enable off;
            client_max_body_size 0;

            # this executes the njs code to determine if we need to amend the selected security policy
            js_content napPolicySelector.handleRequest;
        }

```

Looking in the napPolicySelector.js 

An async function is set up, accepting the request as 'r':
```javascript
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
        r.error("executing chrome example");
        policy_choice = allowedIp ? "medium" : "default";
    }
    else if (agent.toLowerCase().indexOf("curl") > -1) {
        r.error("executing curl example");
        policy_choice = allowedIp ? "medium" : "strict";
    } else {
        r.error("executing non-chrome example");
        policy_choice = allowedIp ? "medium" : "strict";
    }

    r.error("Policy Choice: " + policy_choice);

    r.internalRedirect("/" + policy_choice + "/" + r.uri);
}


export default {
    handleRequest
}

```

The function reads the value from the nginx.conf map directive to determine if the IP address is allowed or not.  Depending on the IP and the User-Agent, a selection for a policy is made.

The selection then determines which Location Block in the nginx.conf will be read.  In those blocks, the appropriate settings are configured.

For example, for the "default" policy:
```nginx
        location /default {
            internal;
            app_protect_enable on;
            app_protect_security_log_enable on;
            app_protect_policy_file "/etc/nginx/customer_default.json";
            proxy_pass http://arcadia_ingress_nodeports$request_uri;
            if ($request_uri = "/files") {
                status_zone backend_service;
            }
            if ($request_uri = "/api") {
                status_zone app2_service;
            }
            if ($request_uri = "/app3") {
                status_zone app3_service;
            }
            app_protect_security_log "/opt/app_protect/share/defaults/log_all.json" /var/log/app_protect/requests.log;
        }

```

## How to use this example NGINX App Protect configuration 
1. Install NGINX App Protect WAF (Details here https://docs.nginx.com/nginx-app-protect/). 
2. Backup your existing NGINX App Protect configurations.
3. Clone this GitHub repository. From the cloned repository, copy the *nginx.conf* file into your NGINX App Protect host to this location: */etc/nginx/*. Copy the default.conf into */etc/nginx/conf.d/*. Modify the example Ip address and user agent regular expression to your desired value.
4. Reload NGINX.
5. You now have dynamic NGINX App Protect WAF policy selection!
