# nginx-app-protect-dynamic-policy-example
Demonstrate how NGINX Configuration can evaluate the client's user agent info and IP address and apply a NGINX App Protect policy dynamically

Goal: demonstrate how NGINX can evaluate the client user_agent and IP and apply a policy dynamically

Approach: Using native NGINX directives, read and apply logic and apply the proper declarative policy in a dynamic fashion.

Config details: There are many ways to handle this but we leveraged the map directive conditional logic in the NGINX config. With that logic in place, we then set the proper policy "level".

