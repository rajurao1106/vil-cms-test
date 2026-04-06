import express from "express"

const app = express()
app.get("/", async(req, res)=>{
  res.send("api is running")
})
app.listen(1337,()=>console.log("sesrver is running"))