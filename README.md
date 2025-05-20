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
