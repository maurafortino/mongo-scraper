$.getJSON("/articles", function (data) {
  for (let i = 45; i < data.length; i++) {
    const articleTitle = $("<h5>").text(data[i].title);
    const articleSummary = $("<p>").text(data[i].summary)
    const articleLink = $("<a>").attr("href", data[i].link);
    const par = $("<p>").text("Add Note");
    par.attr("data-id", data[i]._id);
    par.addClass("button")
    articleLink.text("click for article");
    $("#articles").append(articleTitle, articleSummary, articleLink, par);
  }
});

$(document).on("click", ".button", function () {
  $("#notes").empty();
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function (data) {

      $("#notes").append("<h2>" + data.title + "</h2> <br>");
      $("#notes").append("<input id='titleinput' name='title' > <br>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea><br>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  const thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function (data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});