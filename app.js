/*var http = require("http");
const port = process.env.PORT || 3001;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World!");
  })
  .listen(port);*/ 
  require("dotenv").config();
  const express = require("express"); 
  const cors = require("cors");
  const multer = require("multer");
  const Joi = require("joi");
  const app = express();
  app.use(express.static("public"));
  const mongoose = require("mongoose");
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/image/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));


  const foodSchema = new mongoose.Schema({
   title:String,
   img_name:String,
   category:String,
   prep_time:String,
   servings:String,
   description:String
  });

  const Food = mongoose.model("Food", foodSchema);

  const upload = multer({ storage: storage });


app.get("/api/foods",async (req,res)=>{
  const foods =  Food.find();
  res.send(foods);
});

app.get("/api/foods/:id", async (req,res)=>{
  const food=await Food.findById(req.params.id);
  res.send(food);
});

app.post("/api/foods", upload.single("img") , async(req,res) => {
  console.log("In post request");

  const result = validateFood(req.body);
  if (result.error) {
  console.log(result.error.details[0].message);
  res.status(400).send(result.error.details[0].message);
  return;
}
  console.log("Passed Validation");

  const food = new Food({
    title: req.body.title, 
    category: req.body.category,
    prep_time: req.body.prep_time,
    servings: req.body.servings,
    description: req.body.description
  });

if (req.file) {
  food.img_name = `image/${req.file.filename}`;
}
 const newFood = await food.save();
  res.status(201).send(newFood);
});

app.put("/api/foods/:id", upload.single("img_name"), async (req, res) => {
  console.log("In put request");

  console.log("Hi" + req.params.id);


  const result = validateFood(req.body);
  if (result.error) {
  console.log(result.error.details[0].message);
  res.status(400).send(result.error.details[0].message);
  return;
}

console.log("Passed Validation");

  const fieldsToUpdate = {
    title: req.body.title,
    category: req.body.category,
    prep_time: req.body.prep_time,
    servings: req.body.servings,
    description: req.body.description
  }

if (req.file) {
  fieldsToUpdate.img_name = `image/${req.file.filename}`;
}
const success = await Food.updateOne({_id: req.params.id}, fieldsToUpdate);
if(!success){
  res.status(400).send("Food with given ID not found");
}else {
  const food = await Food.findById(req.params.id);
  res.status(200).send(food);
}
});

app.delete("/api/foods/:id", (req, res) => {
  console.log("In delete request");
  const food = foods.find((f) => f._id === parseInt(req.params.id));

  if(!food) {
    res.status(400).send("Food with given ID not found");
  }

  const index = foods.indexOf(food);
  foods.splice(index, 1);
  res.status(204).send();
}); 

const validateFood = (food) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    prep_time: Joi.string().required(),
    servings: Joi.string().required(),
    description: Joi.string().required()
  });
  return schema.validate(food);
};

//Listen for incoming requests
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on ${port}`);
});