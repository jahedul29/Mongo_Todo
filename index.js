const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri =
  "mongodb+srv://atlasAdmin:yxvyxvp7mbwF2Fb@cluster0.htb64.mongodb.net/tododb?retryWrites=true&w=majority";

const app = express();

app.use(cors());
//parse application/x - www - form - urlencoded;
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const itemCollection = client.db("tododb").collection("items");

  // Adding items to database
  app.post("/addItem", (req, res) => {
    const item = {
      title: req.body.title,
      description: req.body.description,
      schedule: req.body.schedule,
    };
    itemCollection.insertOne(item).then((result) => {
      res.redirect("/");
    });
  });

  // Getting all items from database
  app.get("/getItems", (req, res) => {
    itemCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  //   Updating an item
  //* loading a single product
  app.get("/getItem/:id", (req, res) => {
    itemCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, docs) => {
        res.send(docs[0]);
      });
  });

  app.patch("/updateItem/:id", (req, res) => {
    console.log("body returned", req.body);
    itemCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            schedule: req.body.schedule,
          },
        }
      )
      .then((result) => res.send(result));
  });

  //   Deleting an item from database
  app.delete("/deleteItem/:id", (req, res) => {
    itemCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result));
  });
});

app.listen(4000, () => {
  console.log(`Listening to 4000`);
});
