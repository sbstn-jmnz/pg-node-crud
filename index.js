const http = require('http')
const fs = require('fs')
const url = require('url')
const db = require('./db')

const server = http.createServer(async (req,res)=>{
  if(req.url == '/' && req.method == 'GET'){
    fs.readFile('./views/index.html',(err, file)=>{
      res.writeHead(200, {'Content-Type':'text/html'})
      res.write(file,'utf8')
      res.end()
    })
  }

  if(req.url == '/ahora' && req.method == 'GET'){
    res.writeHead(200,{'Content-Type': 'application/json'})
    const result = await db.getDate()
    res.write(JSON.stringify(result))
    res.end()
  }

  if (req.url == "/ejercicios" && req.method == "POST") {
    let params = null;
    req.on("data", (body) => {
      params = body;
    });
    req.on("end", async () => {
      const paramsArray = Object.values(JSON.parse(params))
      const result = await db.createExercise(paramsArray)
      console.log(result);
      res.writeHead(200,{'Content-Type':'application/json'})
      res.write(JSON.stringify(result))
      res.end()
    });
  }

  if (req.url == "/ejercicios" && req.method == "GET"){
    const result = await db.getExercises()
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(result));
    res.end();
  }

  if(req.url == "/ejercicios" && req.method == "PUT"){
    let params = null;
    req.on("data", (body) => {
      params = body;
    });
    req.on("end", async () => {
      const paramsArray = Object.values(JSON.parse(params));
      const result = await db.updateExercise(paramsArray);
      console.log(result);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(result));
      res.end();
    });
  }

  if(req.url.startsWith("/ejercicios?") && req.method == "DELETE"){
    const name = url.parse(req.url, true).query.name
    const result = await db.destroyExercise(name)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(result));
    res.end();
  }  
})

server.listen(3000, () => console.log('Escuchando en puerto 3000'))