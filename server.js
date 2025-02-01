const express=require("express")
const{MongoClient}=require("mongodb")
const session=require('express-session')
const bodyParser=require("body-parser")
const Razorpay=require('razorpay')
const otpgenerator=require('otp-generator')
const nodemailer=require("nodemailer");
const app=express()
const port=process.env.port|| 1000
const url="mongodb://127.0.0.1:27017"
const dbname="nosql"
app.set("view engine","ejs")
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));
app.use(bodyParser.urlencoded({extended: false}))
function generateOTP() {
 
    // Declare a digits variable
    // which stores all digits 
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
let o=generateOTP();
async function select(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("login");
        var u=req.body.user;
        var p=req.body.pass;
        req.session.username=u;
        // var name=req.session.name;
        // var email=req.session.email;
        // var age=req.session.age;
        // const profile={name:name,email:email,age:age};
        const newUser={username:u, password:p};
        const result=await collection.findOne(newUser);
        if(result)
        {
            const collection1=db.collection("details");
            const profile=await collection1.findOne({username:u});
            res.render("index1",{u,profile});
        }
        else
        {
            res.send('<script>alert("Invalid credentials");location.href=("http://localhost:1000/login");</script>')
        }
        
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function create(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("login");
        var u=req.body.user;
        var p=req.body.pass;
        var c=req.body.cpass;
        var b=0
        const r={username:u};
        const result=await collection.findOne(r);
        if(p!=c)
        {
            res.send('<script>alert("Password do not match");location.href=("http://localhost:1000/register");</script>')

        }
        else if(result)
        {
            res.send('<script>alert("User already exists");location.href=("http://localhost:1000/register");</script>')

        }
        
        else if(p.length>=8)
        {
            for(var i=0;i<p.length;i++)
            {
                if(p[i]=='@'||p[i]=='#'||p[i]=='$'||p[i]=='*')
                {
                    const newUser={username:u, password:p};
                    const result=await collection.insertOne(newUser);
                    res.send("Your Response has been recorded");
                    break;
                }
                else
                {
                    var b=1
                }
            } 
            if(b==1)
                {
                    res.send('<script>alert("Password must contain atleast one special characters");location.href=("http://localhost:1000/register");</script>');
                }
           else
           {

           }
        
        }
        else if(p.length<8)
        {
            res.send('<script>alert("Password must contain more then 8 characters");location.href=("http://localhost:1000/register");</script>')

        }
       

    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function details(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("details");
        var name=req.body.name;
        var email=req.body.email;
        var age=req.body.age;
        var cn=req.body.cn;
        const newUser={name:name,email:email,age:age,cn:cn};
        const result=await collection.insertOne(newUser);
        res.send('<script>location.href=("http://localhost:1000/register");</script>')

    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function authe(req,res)
{
    const client=new MongoClient(url);
    try
    {
         
         
        console.log("OTP of 4 digits: ")
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("details");
        var email=req.body.user;
        const r={email:email};
        const result=await collection.findOne(r);
        if(result)
        {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'aaradhya25903@gmail.com',
                  pass: 'fzou cynj mhfc yvqd',
                }
              });
              
              var mailOptions = {
                from: 'aaradhya25903@gmail.com',
                to: email,
                subject: 'OTP for reseting the Password',
                text: `Your OTP is ${o}`,
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.render("auth");
        }
        else
        {
            res.send('<script>alert("Invalid emailID");</script>')
        }

    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}

async function update(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("login");
        var otp=req.body.otp;
        var u=req.body.user;
        var p=req.body.pass;
        var c=req.body.cpass;
        const r={username:u};
        const result=await collection.findOne(r);
        if(result)
        {
            if(otp!=o)
            {
                res.send('<script>alert("Invalid OTP");</script>')
            }
            else if(p!=c)
            {
                res.send('<script>alert("Password do not match");location.href=("http://localhost:1000/changepsd")</script>');
            }
            
            else if(p.length>=8)
            {
                for(var i=0;i<p.length;i++)
                {
                    if(p[i]=='@'||p[i]=='#'||p[i]=='$'||p[i]=='*')
                        {

                            const updateUser={username:u, password:p};
                            const update={$set:{password:p}};
                            const filter={username:u}
                            const result=await collection.updateOne(filter,update);
                            res.send('<script>location.href=("http://localhost:1000/thanku");</script>');
                            break;
                        }
                    else
                    {
                        var b=1
                    }
                } 
                if(b==1)
                {
                    res.send('<script>alert("Password must contain atleast one special characters");location.href=("http://localhost:1000/changepsd");</script>');
                }
            }
            else if(p.length<8)
            {
                res.send('<script>alert("Password must contain more then 8 characters");location.href=("http://localhost:1000/changepsd");</script>')    
            }
        }
        else
            {
                res.send('<script>alert("User do not match");location.href=("http://localhost:1000/changepsd")</script>');
            } 
        }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function raj(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Rajasthan";
        var rs=40000;
        var qty=req.body.raj;
        var total=rs*qty;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function mumbai(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Mumbai";
        var rs=30000;
        var qty=req.body.mumbai;
        var total=rs*qty;
        var dat=req.body.arrm;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime,arrival_date:dat};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function goa(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Goa";
        var rs=35000;
        var qty=req.body.goa;
        var total=rs*qty;
        var dat=req.body.arrg;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime,arrival_date:dat};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function kerala(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Kerala";
        var rs=45000;
        var qty=req.body.kerala;
        var total=rs*qty;
        var dat=req.body.arrke;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime,arrival_date:dat};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function kashmir(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Kashmir";
        var rs=50000;
        var qty=req.body.kashmir;
        var total=rs*qty;
        var dat=req.body.arrk;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime,arrival_date:dat};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function dar(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        const u=req.session.username;
        var p="Dargeling";
        var rs=50000;
        var qty=req.body.dar;
        var total=rs*qty;
        var dat=req.body.arrd;
        const currentTime = new Date();
        const items={username:u, place:p,cost:rs,persons:qty,total:total,time:currentTime,arrival_date:dat};
        const result=await collection.insertOne(items);
        res.send('<script>alert("Added to cart");</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function contact(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("contact_us");
        const u=req.session.username;
        var name=req.body.name;
        var email=req.body.email;
        var cn=req.body.c;
        var sub=req.body.sub;
        var m=req.body.m;
        const currentTime = new Date();
        const items={name:name, email:email,cn:cn,sub:sub,Messege:m,time:currentTime};
        const result=await collection.insertOne(items);
        res.send('<script>location.href=("http://localhost:1000/response")</script>');
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function showcart(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        var u=req.session.username;
        const newUser={username:u};
        const x=await collection.find(newUser).toArray()
        .then((x)=>{
            res.render('showcart',{x});
            })
        .catch((y)=>{
                console.log(y)
         })
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}
async function showbill(req,res)
{
    const client=new MongoClient(url);
    try
    {
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection("cart");
        var u=req.session.username;
        const newUser={username:u};
        const x=await collection.find(newUser).toArray()
        let totalCost = 0;
        if(x){
            x.forEach((document) => {
                totalCost += document.total;
                });
                if(totalCost==0)
                {
                    res.send("Cant genereate bill");
                }
                else
                {
                    let gst=(5/100)*totalCost;
                    let amt=(totalCost+gst);
                    const currentTime = new Date();
                    const collection1=db.collection("details");
                    const profile=await collection1.findOne({username:u});
                     res.render('bill',{x,totalCost,gst,amt,u,currentTime,profile});
                    console.log(`Total Cost for User ${u}: ${totalCost}`);
                }
           
        }
    }
    catch(err)
    {
        console.error(err);
    }
    finally
    {
        await client.close();
        console.log("Disconnected ");
    }
}   
// async function showbill(req,res)
// {
//     const client=new MongoClient(url);
//     try
//     {
//         await client.connect();
//         const db=client.db(dbname);
//         const collection=db.collection("cart");
//         var u=req.session.username;
//         const newUser={username:u};
//         const x=await collection.find(newUser).toArray()
//         .then((x)=>{
//             res.render('bill',{x});
//             })
//         .catch((y)=>{
//                 console.log(y)
//          })
//          const cursor={username:u};
//         const r=await collection.find(cursor).toArray()
//         let totalCost = 0;
//         if(r)
//         {
//             r.forEach((document) => {
//             totalCost += document.total;
//             }); 
//         console.log(`Total Cost for User ${u}: ${totalCost}`);
//         // const sum={s:totalCost};
//     //    const result= await collection.insertOne(sum);
//         res.render('bill', {totalCost});

//         }
        
//     }
//     catch(err)
//     {
//         console.error(err);
//     }
//     finally
//     {
//         await client.close();
//         console.log("Disconnected ");
//     }
// }
async function d(req,res){
const client=new MongoClient(url);
    try{
        await client.connect();
        const db=client.db(dbname);
        const collection=db.collection('cart');
        const place=req.body.place;
        const username=req.session.username;
        const result=await collection.findOne({username:username,place:place});
        if(result){
            const result1=await collection.deleteOne({username:username,place:place})
            if(result1){
            const x=await collection.find({username:username}).toArray()
            .then((x)=>{
                res.render('showcart',{x});
            })
            .catch((y)=>{
                console.log(y);
            });
        }
    }
        else{
            res.send('Item not deleted');
        }
    }
    catch(error){
        throw error;
    }
    finally{
        client.close();
        console.log('Disconnected');
    }
}
app.post('/dar',(req,res)=>
{
    dar(req,res);
})
app.post('/mumbaidetails',(req,res)=>
{
    res.render("mumbaibook");
})
app.post('/rajdetails',(req,res)=>
{
    res.render("rajbook");
})
app.post('/kashmirdetails',(req,res)=>
{
    res.render("kashmirbook");
})
app.post('/dardetails',(req,res)=>
{
    res.render("darbook");
})
app.post('/keraladetails',(req,res)=>
{
    res.render("keralabook");
})
app.post('/goadetails',(req,res)=>
{
    res.render("goabook");
})
app.post('/gdetails',(req,res)=>
{
    res.render("goadetails");
})
app.post('/mdetails',(req,res)=>
{
    res.render("mumbaidetails");
})
app.post('/ddetails',(req,res)=>
{
    res.render("dardetails");
})
app.post('/rdetails',(req,res)=>
{
    res.render("rajdetails");
})
app.post('/kedetails',(req,res)=>
{
    res.render("keraladetails");
})
app.post('/kdetails',(req,res)=>
{
    res.render("kashmirdetails");
})

const razorpay = new Razorpay({key_id:'rzp_test_SXHcaLDzi2oToA',key_secret:'vV1guYIqr53ZExPcWzz1zpAK'})
app.get('/register',(req,res)=>
{
    res.render("register")
})
app.post('/create',(req,res)=>
{
    create(req,res);
})
app.get('/userdetail',(req,res)=>
    {
        res.render("userdetail")
    })
app.post('/details',(req,res)=>
    {
        details(req,res);
    })
app.get('/changepsd',(req,res)=>
{
    res.render("changepsd");
})
app.post("/auth",(req,res)=>
{
    authe(req,res);
})
app.post("/update",(req,res)=>
{
    update(req,res);
})
app.post('/delete',(req,res)=>
{
    d(req,res);
})
app.get('/response',(req,res)=>
{
    res.render("response")
})
app.get('/thanku',(req,res)=>
{
    res.render("thanku")
})
app.post('/contact',(req,res)=>
    {
        contact(req,res);
    }) 
app.post('/logout',(req,res)=>
{
    res.render("index");
})
app.get('/login',(req,res)=>
{
    res.render("index");
})
app.post('/login',(req,res)=>
{
    select(req,res);
})
app.get("/trips",(req,res)=>
    {
        res.render("trips");
    })
app.post("/raj",(req,res)=>
{
    raj(req,res);
})
app.post("/mumbai",(req,res)=>
{
    mumbai(req,res);
})
app.post("/goa",(req,res)=>
{
    goa(req,res);
})
app.post("/kerala",(req,res)=>
{
    kerala(req,res);
})
app.post("/kashmir",(req,res)=>
{
    kashmir(req,res);
})
app.post("/showcart",(req,res)=>
{
    showcart(req,res);
})
app.post("/logout",(req,res)=>
{
    res.render("login");
})
app.get("/bills",(req,res)=>
{
    res.render("bill");
})
app.post("/bills",(req,res)=>
{
    showbill(req,res);
})
app.post('/mum',(req,res)=>
{
    res.send('<script>alert("Login required");location.href=("http://localhost:1000/login")</script>')
})
app.post('/order',(req,res)=>{
    
    const {amount}=req.body
    let options={
        amount:amount*100,
  
        currency:"INR"
    };

    razorpay.orders.create(options,function(err,order){
    
        console.log(order)
        res.json(order)
})
   
    // let order=await instance.orders.create({
    //     amount:amount*100,
    //     currency:"INR",
    //     receipt:"receipt#1"
    // })

    // res.status(201).json({
    //     success:true,
    //     order,
    //     amount
    // })
})

app.post('/is-order-complete',(req,res)=>{
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument)=>{
        if(paymentDocument.status=='captured'){
            res.send('Payment Successfull')
 
        //     const client=new MongoClient(url)
        //     try{
        //         await client.connect()
        //         const db=client.db(dbName)
        //         const collection=db.collection('cart')
        //         const cart1=collection.deleteMany({Username:username1})
            
        //  }
        //  catch(error){
        //     throw error;
        // }
    }
    

        else{
            res.send("Payment Successful")
        }
    })
})
app.post('/thanku',(req,res)=>
    {
        res.render("index");
    })
app.listen(port,() =>
{
    console.log(`App listening on port ${port}`)
})