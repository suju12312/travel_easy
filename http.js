const http= require('http')
// http.createServer((req,res)=>
//     {
//         res.writeHead(200,{'Content-Type':'text/html'});
//         res.write("<h1>Hello World</h1>")
//         res.end("Ok")
//     }).listen(8080);
const fs=require('fs');
content="Hello World";
fs.writeFile('abc.txt',content,(err)=>
{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log("Saved");
    }
})
// fs.readFile('abc.txt',{encoding:"utf-8"},(err,data)=>
// {
//     if(err)
//     {
//         console.log(err)
//     }
//     else{
//         console.log(data);
//     }
// })
fs.readFile('abc.txt',(err,data)=>
{
    if(err)
    {
        console.log(error)
    }
    else{
        console.log(data.toString());
    }
    console.log("Terminated")
})
