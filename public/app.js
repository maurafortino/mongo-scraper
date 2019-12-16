$.getJSON("/articles", function(data) {
    for (let i = 45; i < data.length; i++) {
        const articleTitle = $("<h2>").text(data[i].title);
      //   const articleSummary = $("<p>").text(data[i].summary)
      //   const articleLink = $("<a>").attr("href". data[i].link);
      //   const button = $("<button>").text("Add Note");
      //   button.attr("data-id", data[i]._id);
      //   articleLink.text("click for article");
      // $("#articles").append(articleTitle, articleSummary, articleLink, button) ;
      console.log(data[i].title);
    }
  });
  
  $(document).on("click", "button", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);

        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='note-title' >");
        $("#notes").append("<textarea id='bodyinput' name='note-body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    const thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });