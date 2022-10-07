const http=require('http');
const fs=require('fs');
const requests=require("requests");
const express = require("express");
const path=require("path");
const app=express();


const staticpath=path.join(__dirname,"../public");

//builtin middleware
app.use(express.static(staticpath));
const homefile=fs.readFileSync('./public/index.html','utf-8');


const replaceVal=(tempVal,orgval)=>{
    let temperature=tempVal.replace("{%tempval%}",orgval.main.temp);
    temperature=temperature.replace("{%tempmax%}",orgval.main.temp);
    temperature=temperature.replace("{%tempmin%}",orgval.main.temp);
    temperature=temperature.replace("{%Location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    return temperature;
}


const server=http.createServer((req,res)=>{
    if (req.url="/"){
        
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune,In&appid=8d6d47b93f877a35a34e51349bd1ef1f')
         
        .on('data', function (chunk) {
            const objdata=JSON.parse(chunk);
            const arrdata=[objdata];
            const realTimeData=arrdata.map((val)=>replaceVal(homefile,val)).join("");
           res.write(realTimeData);
      })
    .on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
    res.end();
});
}
});
server.listen(8000,"127.0.0.1");