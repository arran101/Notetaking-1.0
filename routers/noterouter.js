//express
const express = require("express");

//NoteRouter class
class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();
    // bind the different methods (if not using arrow function, should bind the method to the class)
    // e.g., router.get("/", this.get.bind(this));
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  //get function, uses the list function from the noteservice to get the user, then just responds with the notes in a json format
  get(req, res) {
    return this.noteService
      .list(req.auth.user)
      .then((notes) => {
        console.log("GET");
        console.log(notes);
        res.json(notes);
      })
      .catch((err) => res.status(500).json(err));
  }

  //so this uses the add function from noteservice, which has two parameters, note and user.
  post(req, res) {
    return this.noteService
      .add(req.body.note, req.auth.user)
      .then(() => {
        return this.noteService.list(req.auth.user);
      })
      .then((notes) => {
        res.json(notes);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
  //so this put request uses the update function from noteservice which has params id, note and user
  //the update function also updates the json file
  //the first .then runs the list function in noteservice, which returns the array of notes from that user
  //the second .then will then respond with all the notes using .json to read them
  put(req, res) {
    let id = req.params.id;
    let note = req.body.note;
    let user = req.auth.user;
    return this.noteService
      .update(id, note, user)
      .then(() => this.noteService.list(user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err)); // i had the ; after the previous .then and was wondering why it was fucking up the .catch, i realise now why, cos its closing off the element
  }

  //similar to the PUT above, but runs the remove function instead
  delete(req, res) {
    let id = req.params.id;
    let user = req.auth.user;
    return this.noteService
      .remove(id, user)
      .then(() => this.noteService.list(user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err));
  }
}

module.exports = NoteRouter;
