/*---------------------------------------------------- account creation ----------------------------------------------------*/ 

http://localhost:4100/register , method = post
 give all data, each data is required, please don't miss any of them.
ex: {
  "name":"Dev",
  "email":"dev@gmail.com",
  "password":"avinash"
}

/*---------------------------------------------------- account login ----------------------------------------------------*/ 


http://localhost:4100/login , method = post
give registerd email and password
ex: {
    "email":"avinash@gmail.com",
  "password":"avinash"
}

/*---------------------------------------------------- account logout ----------------------------------------------------*/ 


http://localhost:4100/logout , method = get
you will be logged out

/*---------------------------------------------------- ip information(city) ----------------------------------------------------*/ 


http://localhost:4100/city/8.8.8.8 , method = get
 
this will give you city name of respective API