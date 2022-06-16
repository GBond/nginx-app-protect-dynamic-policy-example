# nginx-app-protect-dynamic-policy-select-example
Goal: Demonstrate how NGINX Configuration can evaluate the client's user agent info and IP address and apply a NGINX App Protect policy dynamically.

Approach: Using native NGINX directives, read the client request info and apply the proper NGINX App Protect's declarative policy in a dynamic fashion.

Configuration details: In this simple example, NGINX Plus App Protect detects requesting client's user agent and IP address (via built-in NGINX Plus request variables). We then use the values to apply our custom conditional logic for selecting the desired policy level. With the desired level determined, the client session is sent to one of the Virtual Servers that maps one of the policy levels (Default, Medium, & Strict).  

