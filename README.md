# NGINX App Protect Dynamic Policy Selection Example 

### Goal 
Demonstrate how NGINX Configuration can evaluate the client's user agent info and IP address and apply a NGINX App Protect policy dynamically.

### Approach 
Using native NGINX directives, read the client request info and apply the proper NGINX App Protect's declarative policy in a dynamic fashion.

### Configuration details 
In this simple example, NGINX Plus App Protect detects requesting client's user agent and IP address (via built-in NGINX Plus request variables *$remote_addr* & *$http_user_agent*). We also leverage the *map* directive as it is an effiecient way apply case conditions while applying custom variables.

```nginx
  map $remote_addr $ip_flag {
      "71.105.178.190"     yes_friendly_IP;
      none                 no_friendly_IP;
  }
  map $http_user_agent $agent_flag {
      "~AppleWebKit.*Version/[1-4]..*Safari"                                yes_friendly_agent;
      "vanguard.com:Other Agent.*$"                                         no_friendly_agent;
  }
}
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
            app_protect_enable off;
            app_protect_policy_file "/etc/nginx/conf.d/medium_policy.json";
            proxy_pass  http://20.55.234.99:49154?=$ip_flag&$agent_flag&$location;
            app_protect_security_log_enable on;
            app_protect_security_log "/opt/app_protect/share/defaults/log_all.json" /var/log/app_protect/requests.log;
```            

With the proper Virtual Server block selected, the client request now under the desired policy that was dynamically selected via our customer logic!
