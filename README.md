#binder-frontedn

# creted a vite + react product using application and removed unneccesaay code

# to design the use we will use daisy UI and tailwindcss

# installed tailwind

# daisyUI for all UI components

# navbar done

# routers using reactrouter

# routing is very important for SEO changing routes again and again gives issue

# browser-router-dom > Routes -> route > child routes

# then created outlet

-- creating a login page
---- using axios package to make an api call
--- cors error (if we are trying to make api call from x to y other domain ) -> CORS error is from browser for security reason
-- install cors in backend as middle ware in app.js with config {origin and ceredentails}
and while makeing api call from frontend pass {withcredentails: true}

-- also axios can't set cookies for non https sites so we need to whitelist them set withCredientails : true

--- install redux toolkit -- create store

install react-redux + toolkit --> configure store or create store -> add provider to application -> then create a slice -> add reducer to store
--> now to add data we useDespath hook we dispatch an action to add data in store
--- proivde this store to root of application <provider>
-- now we can use store in all compoents

---- if not logged in redirect ot logoin from any page using token check and error 401 from backend auth api

--- logout - clear cookies

-- component design

body
navbar  
 if route = / => load feed
if Route = /login => login page
if Route = /connection => all connections shown
Route = /profile => Profile

# Deployment

- Signup on AWS
- Launch instance
- chmod 400 <secret>.pem
- ssh -i "binder-secret.pem" ubuntu@ec2-13-61-4-226.eu-north-1.compute.amazonaws.com
- Install Node version 16.17.0
- Git clone

deployment

- Frontend
  - npm install -> dependencies install
  - npm run build
  - sudo apt update
  - sudo apt install nginx
  - sudo systemctl start nginx
  - sudo systemctl enable nginx
  - Copy code from dist(build files) to /var/www/html/
  - sudo scp -r dist/\* /var/www/html/
  - Enable port :80 of your instance
- Backend

  - updated DB password
  - allowed ec2 instance public IP on mongodb server
  - npm install pm2 -g
  - pm2 start npm --name "binder-back" -- start
  - pm2 logs
  - pm2 list, pm2 flush <name> , pm2 stop <name>, pm2 delete <name>
  - config nginx - /etc/nginx/sites-available/default
  - restart nginx - sudo systemctl restart nginx
  - Modify the BASEURL in frontend project to "/api"

    Frontend = http://13.61.4.226/
    Backend = http://13.61.4.226:3000/

    Domain name = binder.com => 43.204.96.49

    Frontend = binder.com
    Backend = devtinder.com:3000 => devtinder.com/api

    at sudo nano /etc/nginx/sites-available/default --> nginx configuration

    nginx config :

    server_name http://13.61.4.226/;

    location /api/ {
    proxy_pass http://localhost:3000/; # Pass the request to the Node.js app
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    }

    sudo systemctl restart nginx

    --- now our backend at /api and forntend at ip/

    -- modify BASE_URL = /api

    -- then git pull -> then agin npm build -> copy that to sudo scp -r dist/\* /var/www/html/

-- g8fyolprojects.xyz (domain)
-- chnaged nameserver to cloudflare's
