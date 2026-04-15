/*var http = require("http");
const port = process.env.PORT || 3001;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World!");
  })
  .listen(port);*/ 

  const express = require("express"); 
  const cors = require("cors");
  const multer = require("multer");
  const Joi = require("joi");
  const app = express();
  app.use(express.static("public"));
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
  
  const upload = multer({ storage: storage });

let foods = [
  {
    "_id": 1,
    "title": "Classic Margherita Pizza",
    "img_name": "image/Pizza.png",
    "category": "Pizza",
    "prep_time": "20 min",
    "servings": "2-3",
    "description": "Fresh mozzarella, tomatoes, and basil on a thin-crust base."
  },
  {
    "_id": 2,
    "title": "Greek Salad",
    "img_name": "image/fresh-greek-salad.png",
    "category": "Salad",
    "prep_time": "10 min",
    "servings": "2-4",
    "description": "Cucumbers, tomatoes, Kalamata olives, red onion, and feta with lemon-oregano dressing."
  },
  {
    "_id": 3,
    "title": "Lemon Herb Chicken",
    "img_name": "image/Lemon herb chicken.png",
    "category": "Main",
    "prep_time": "30 min",
    "servings": "3-4",
    "description": "Pan-seared chicken breasts marinated in lemon, garlic, and rosemary."
  },
  {
    "_id": 4,
    "title": "Jay's Burger Sliders",
    "img_name": "image/Burger Sliders.png",
    "category": "Sandwiches",
    "prep_time": "25 min",
    "servings": "6",
    "description": "Hawaiian rolls with seasoned beef patties and melted cheese—party perfect."
  },
  {
    "_id": 5,
    "title": "Chicken Alfredo Garlic Bread",
    "img_name": "image/Garlic Bread.png",
    "category": "Comfort",
    "prep_time": "35 min",
    "servings": "4",
    "description": "Garlic bread topped with chicken, Alfredo sauce, and melted cheeses."
  },
  {
    "_id": 6,
    "title": "Pizza Sliders (Emily's)",
    "img_name": "image/Pizza Sliders.png",
    "category": "Snacks",
    "prep_time": "20 min",
    "servings": "8",
    "description": "Pull-apart sliders with mozzarella, pepperoni, and garlic butter."
  }
  
]

app.get("/api/foods",(req,res)=>{
  res.send(foods);
});

app.get("/api/foods/:id", (req,res)=>{
  const food=foods.find((f)=>f._id===parseInt(req.params.id));
  res.send(food);
});

app.post("/api/foods", upload.single("img") ,(req,res) => {
  console.log("In post request");

  const result = validateFood(req.body);
  if (result.error) {
  console.log(result.error.details[0].message);
  res.status(400).send(result.error.details[0].message);
  return;
}
  console.log("Passed Validation");

  const food = {
    _id: foods.length + 1,
    title: req.body.title, 
    category: req.body.category,
    prep_time: req.body.prep_time,
    servings: req.body.servings,
    description: req.body.description
  }
if (req.file) {
  food.img_name = `image/${req.file.filename}`;
}
  foods.push(food);
  res.status(201).send(food);
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