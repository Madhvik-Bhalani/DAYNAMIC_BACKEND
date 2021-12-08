const express=require('express')
const app=express();
const path=require('path')
const hbs=require('hbs')

// set view engine
app.set("view engine","hbs")
viewpath=path.join(__dirname,"/templates/views")
app.set("views",viewpath)

// set partials
partialpath=path.join(__dirname,"/templates/partials")
hbs.registerPartials(partialpath)

// set static ripo.. path
staticpath=path.join(__dirname,"static")
app.use(express.static(staticpath))



app.get("/",(req,res)=>{
    res.statusCode=200;
    res.render("index",{
        title:"Daynamic_Backend"
    })
    
})

// server
const port=process.env.PORT || 200
app.listen(port,()=>{
    console.log(`server start at ${port}`);
})