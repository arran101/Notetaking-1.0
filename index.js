//modules
//3rd party
const express = require("express");
const bodyParser = require("body-parser");
const hb = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const app = express();
//native
const fs = require("fs");
const path = require("path");


const NoteService = require("./services/noteservice.js");
const NoteRouter = require("./routers/noterouter.js");
const config = require("./stores/config.json")["development"];

//application level middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

//handlebars
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//basic auth set up
const AuthChallenger = require("./authChallenger");

// Set up basic auth
app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(path.join(__dirname, config.users)))
    ),
    challenge: true,
    realm: "Note Taking Application",
  })
);

//port
let port = 3000;

//single view router
const noteService = new NoteService(path.join(__dirname, config.notes));

app.get("/", (req, res) => {
  noteService.list(req.auth.user).then((data) => {
    res.render("index", {
      user: req.auth.user,
      notes: data,
    });
  });
});
// annoying that it took ages to figure out why my code wasn't working, to find it was because i put res infront of req in the params here 
// app.get("/", (res, req) => {
//   noteService.list(req.auth.user).then((data) => {
//     res.render("index"),
//       {
//         user: req.auth.user,
//         notes: data,
//       };
//   });
// });

//this allows it to fire off api request
app.use("/api/notes", new NoteRouter(noteService).router());

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
