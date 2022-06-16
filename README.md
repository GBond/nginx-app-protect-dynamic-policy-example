# NGINX App Protect Dynamic Policy Selection Example 

### Goal 
Demonstrate how NGINX Configuration can evaluate the client's user agent info and IP address and apply a NGINX App Protect policy dynamically.

### Approach 
Using native NGINX directives, read the client request info and apply the proper NGINX App Protect's declarative policy in a dynamic fashion.

### Configuration details 
In this simple example, NGINX Plus App Protect detects requesting client's user agent and IP address (via built-in NGINX Plus request variables).  

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


With the desired level determined, the client session is sent to one of the Virtual Servers that maps one of the policy levels (Default, Medium, & Strict). 
