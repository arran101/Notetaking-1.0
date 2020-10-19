//fs
const fs = require("fs");

//noteservice class
class NoteService {
  constructor(file) {
    this.file = file;
    this.initPromise = null;
    this.init();
    this.notes = {};
  }

  // i had this in an else statement, but the try statement is a lot better cos it can then add the catch as well.
  // once the data is read, it parses it from json and stores it in this.notes. then the whole function is resolved with this.notes.
  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          this.notes = JSON.parse(data);
        } catch (e) {
          return reject(e);
        }
        return resolve(this.notes);
      });
    });
  }

  //used to update the notes.json file
  write() {
    console.log(4);
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(this.notes);
      });
    });
  }

  // what i think its doing is making a new variable, initPromise, and reading the notes.json file. then it just returns initPromise. the catch clears the notes and tries to write notes(?) back in. I'm not clear on the catch, need someone to explain it to me
  //actually im not completely sure if it runs once at the start, or just runs when the list function is called. need to ask for clarification cos its supposed to just run once, but is called in all the other functions?
  //its something i didn't have initially, but saw it was needed in the answer repo, which is why i'm not clear on what it is doing
  init() {
    if (this.initPromise === null) {
      this.initPromise = new Promise((resolve, reject) => {
        this.read()
          .then(() => {
            resolve();
          })
          .catch(() => {
            this.notes = {};
            this.write().then(resolve).catch(reject);
          });
      });
    }
    return this.initPromise;
  }

  //this function takes the users, if there is a user it will return the users notes. I'm not completly sure what the init function is doing here
  list(user) {
    if (typeof user !== "undefined") {
      return this.init() //just checks to see if it has run once.
        .then(() => {
          return this.read();
        })
        .then(() => {
          if (typeof this.notes[user] === "undefined") {
            return [];
          } else {
            return this.notes[user];
          }
        });
    } else {
      return this.init().then(() => {
        return this.read();
      });
    }
  }

  // add function which pushes the note onto this.notes and returns this.write so it will be written into the notes.json file
  add(note, user) {
    return this.init().then(() => {
      if (typeof this.notes[user] === "undefined") {
        this.notes[user] = [];
      }
      this.notes[user].push(note);
      return this.write();
    });
  }

  //this update takes the additional index parameter so it can find the specific note that is being updated and replace it with the updated note.
  // i should probs add what is in the answer repo, which throws errors if the user or note doesn't exist.
  update(index, note, user) {
    return this.init().then(() => {
      this.notes[user][index] = note;
      return this.write();
    });
  }
  // update(index, note, user) {
  //   return this.init().then(() => {
  //     if (typeof this.notes[user] === "undefined") {
  //       throw new Error("Cannot update a note, if the user doesn't exist");
  //     }
  //     if (this.notes[user].length <= index) {
  //       throw new Error("Cannot update a note that doesn't exist");
  //     }
  //     this.notes[user][index] = note;
  //     return this.write();
  //   });
  // }

  //this splices the notes, aka deletes them.
  //again should consider adding the errors in the answer repo
  //i had to change this to remove cos i had to call the delete function in the router.
    remove(index, user) {
      return this.init().then(() => {
        return this.read().then(() => {
          this.notes[user].splice(index, 1);
          return this.write();
        });
      });
    }
  }
//   remove(index, user) {
//     return this.init().then(() => {
//       if (typeof this.notes[user] === "undefined") {
//         throw new Error("Cannot remove a note, if the user doesn't exist");
//       }
//       if (this.notes[user].length <= index) {
//         throw new Error("Cannot remove a note that doesn't exist");
//       }
//       return this.read().then(() => {
//         this.notes[user].splice(index, 1);
//         return this.write();
//       });
//     });
//   }
// }
module.exports = NoteService;
