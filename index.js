const express = require("express");
const app = express();
const port = process.env.PORT || 4700;
const axios = require("axios");
require("./db.js");
const product = require("./productModel");
app.use(express.json());

app.post("/addProduct", async (req, res) => {
  try {
    const demoProduct = await axios.get(
      "https://fakestoreapi.com/products?limit=25"
    );
    const { data } = demoProduct;
    const savedProduct = await product.insertMany(data);
    if (!savedProduct) return res.status(400).send("Something went wrong");
    return res.status(200).json({ msg: "data saved!", products: savedProduct });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Something went wrong");
  }
});

app.get("/getAllProduct",async(req,res)=>{
    try{
        const products=await product.find({});
        if(!products)
        return res.status(400).send("Something went wrong!");
        return res.status(200).send(products);
        
    }catch(err){
        console.log(err);
        return res.status(400).send("something went wrong!")
    }
})

app.get("/aggregate",async(req,res)=>{
    try{
        const result=await product.aggregate(
            [
                {
                    $match:{
                        price:{$gt:110}
                    }
                },
                {
                    $sort:{
                        price:1
                    }
                }
            ]);
            res.send(result)

    }catch(err){
        console.log(err)
        return res.status(400).send("something went wrong!")
    }
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
