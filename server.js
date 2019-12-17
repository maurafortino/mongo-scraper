const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");


const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

mongoose.connect("mongodb://localhost/classConnection", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("http://cuchimes.com/").then(function (response) {
        const $ = cheerio.load(response.data);

        $("div.blog-entry-content").each(function (i, element) {
            const count = i;
            const result = {};
            
            result.title = $(element).children("header.entry-header").children("h2.entry-title").children("a").text();
            result.summary = $(element).children("div.entry-summary").children("p").text();
            result.link = $(element).children("header.entry-header").children("h2.entry-title").children("a").attr("href");

            if(result.title && result.link && result.summary){

            
            db.Site.create(result).then(function (dbSite) {
                console.log(dbSite);
                count++;
            }).catch(function (err) {
                console.log(err)
            });

        }
        });

        res.send("Site scraped")
    });
});

app.get("/", function (req, res) {
    db.Site.find({})
        .then(function (dbArticle) {
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/articles", function (req, res) {
    db.Site.find({}).then(function(dbSite) {
        res.json(dbSite);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
    db.Site.findOne({ _id: req.params.id }).populate("note").then(function (dbSite) {
        res.json(dbSite);
    }).catch(function (err) {
        res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Site.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function (dbSite) {
        res.json(dbSite);
    }).catch(function (err) {
        res.json(err);
    });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});