//this uses handlebars.compile, which means its using the handlebars cdn
//this notesTemplate will set out the {{this}} text area on the screen, while using the data-id as the index position
//also adds a remove button class, which also has the index in it can specify the note to be removed.
var notesTemplate = Handlebars.compile(
  `
          {{#each notes}}
          <div class="note">
              <span class="input"><textarea data-horse="pony" data-id="{{ @index }}"> {{ this }}</textarea></span>
              <button class="remove btn btn-xs" data-id="{{ @index }}"><i class = "fa fa-trash" aria-hidden="true"></i></button>
              </div>
              {{/each}}
          `
);

//so this function re-renders the page every time we update our notes by pushing the notes into the above notesTemplate
const reloadNotes = (notes) => {
  console.log("reloading");
  $("#notes").html(notesTemplate({ notes: notes }));
};

//these two functions make a message appear and disappear from the dom on saving a note
const beginSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").show();
};
const endSaving = (target) => {
  $(target).prop("disabled", true);
  $(".saving").hide();
};

//onready function
$(() => {
  //I had an append the notes here before, but i do think having a reloadNotes function and running it here is better
  $.get("/api/notes/", function (data) {
    //   console.log(data)
    reloadNotes(data);
  });

  //so this event listener listens to the add button, which prevents the default action and instead gets the value and then uses axios to send the post request and run the reloadNotes function when the notes come back
  $("#add").on("submit", (event) => {
    event.preventDefault();

    let value = $("textarea[name=note").val();
    console.log(value);
    if (value === "") {
      return;
    }
    $("textarea[name=note").val();
    axios
      .post("/api/notes/", {
        note: value,
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //this adds an event listener to the notes div, which allows for put to be run on backend. Note the beginSaving and endSaving functions, which give a saving message. when its done it reloads the notes again using the reloadNotes function
  $("#notes").on("blur", "textarea", (event) => {
    beginSaving(event.currentTarget);

    axios
      .put("/api/notes/" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });

  //this event listener listens to the remove class, sends delete event for the delete function to be run on the backend. it then runs reloadNotes function.
  $("#notes").on("click", ".remove", (event) => {
    beginSaving(event.currentTarget);
    console.log($(event.currentTarget).data("id"));

    axios
      .delete("/api/notes/" + $(event.currentTarget).data("id"))
      .then((res) => {
        endSaving(event.currentTarget);
        reloadNotes(res.data);
      })
      .catch((e) => {
        endSaving(e.currentTarget);
        alert(e);
      });
  });
});
