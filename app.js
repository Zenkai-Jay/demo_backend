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
  const app = express();
  app.use(express.static("public"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
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
    "img_name": "images/margherita.jpg",
    "category": "Pizza",
    "prep_time": "20 min",
    "servings": "2-3",
    "description": "Fresh mozzarella, tomatoes, and basil on a thin-crust base."
  },
  {
    "_id": 2,
    "title": "Greek Salad",
    "img_name": "images/greek-salad.jpg",
    "category": "Salad",
    "prep_time": "10 min",
    "servings": "2-4",
    "description": "Cucumbers, tomatoes, Kalamata olives, red onion, and feta with lemon-oregano dressing."
  },
  {
    "_id": 3,
    "title": "Lemon Herb Chicken",
    "img_name": "images/lemon-chicken.jpg",
    "category": "Main",
    "prep_time": "30 min",
    "servings": "3-4",
    "description": "Pan-seared chicken breasts marinated in lemon, garlic, and rosemary."
  },
  {
    "_id": 4,
    "title": "Jay's Burger Sliders",
    "img_name": "images/burger-sliders.jpg",
    "category": "Sandwiches",
    "prep_time": "25 min",
    "servings": "6",
    "description": "Hawaiian rolls with seasoned beef patties and melted cheese—party perfect."
  },
  {
    "_id": 5,
    "title": "Chicken Alfredo Garlic Bread",
    "img_name": "images/alfredo-garlic-bread.jpg",
    "category": "Comfort",
    "prep_time": "35 min",
    "servings": "4",
    "description": "Garlic bread topped with chicken, Alfredo sauce, and melted cheeses."
  },
  {
    "_id": 6,
    "title": "Pizza Sliders (Emily's)",
    "img_name": "images/pizza-sliders.jpg",
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

//Listen for incoming requests
app.listen(3001, () => {
    console.log("Server is running on port");
});