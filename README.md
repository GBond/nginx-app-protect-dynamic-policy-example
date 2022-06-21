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

```nginx
    keyval_zone zone=one:1m type=string state=/etc/nginx/one.keyval;
    keyval $http_x_forwarded_for $ip_flag zone=one; # Client address is the key,

```

We then use the values to apply our custom conditional logic for selecting the desired policy level. 

```nginx
        if ($ip_flag = yes_friendly_IP){
            set $friendy_flag T;
        }

        if ($agent_flag = 'yes_friendly_agent'){
            set $friendy_flag "${friendy_flag}T";
        }

         #default policy is strict
        set $location "strict";
        
        if ($friendy_flag  = "TT") {
               set $location "default";
        }

        if ($friendy_flag  = "T") {
               set $location "medium";
        }
```

With the desired level determined, the client session is sent to one of the Virtual Servers that maps one of the policy levels: Default, Medium, & Strict. 

Medium Policy Virtual Server block:  
```nginx
       location @medium {
            app_protect_enable on;
            app_protect_policy_file "/etc/nginx/conf.d/medium_policy.json";
            proxy_pass  http://20.55.234.99:49154?=$ip_flag&$agent_flag&$location;
            app_protect_security_log_enable on;
            app_protect_security_log "/opt/app_protect/share/defaults/log_all.json" /var/log/app_protect/requests.log;
```            

With the proper Virtual Server block selected, the client request now under the desired policy that was dynamically selected via our customer logic!

## How to use this example NGINX App Protect configuration 
1. Install NGINX App Protect WAF (Details here https://docs.nginx.com/nginx-app-protect/). 
2. Backup your existing NGINX App Protect configurations.
3. Clone this GitHub repository. From the cloned repository, copy the *nginx.conf* file into your NGINX App Protect host to this location: */etc/nginx/*. Copy the default.conf into */etc/nginx/conf.d/*. Modify the example Ip address and user agent regular expression to your desired value.
4. Reload NGINX.
5. You now have dynamic NGINX App Protect WAF policy selection!
