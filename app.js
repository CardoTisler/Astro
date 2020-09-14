var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    cookieParser = require("cookie-parser"),
    session = require("express-session")

var Recipe = require("./models/recipe.js"),
    Comment = require("./models/comment.js"),
    User = require("./models/user.js");

//requiring routes
var commentsRoutes = require("./routes/comments"),
    recipesRoutes = require("./routes/recipes"),
    indexRoutes = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// mongoose.connect("mongodb://localhost/recipeSite");
mongoose.connect("mongodb+srv://cardo:egg@astro-xkx66.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to MongoDB successfully!")
}).catch(err => {
    console.log("ERROR: ", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// memory leak fix
var MemoryStore = require('session-memory-store')(session);
app.use(cookieParser());
app.use(require("express-session")({
    secret: "Spaceworms are bad pets",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore()
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //makes currentUser variable global
    res.locals.currentUser = req.user;
    next();
 });

app.use(commentsRoutes);
app.use(recipesRoutes);
app.use(indexRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server running on port 3000.");
});