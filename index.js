const cookieParser = require('cookie-parser')

const customerRoute = require("./routes/customer.route");
const employeeRoute = require("./routes/employee.route");
const productRoute = require("./routes/product.route");
const authRoute = require("./routes/auth.route");
const customerApi = require("./api/customer/customer");

const authMiddleware = require("./middleware/auth.middleware");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));

app.get("/", function (req, res) {
  res.render("index");
});

app.use("/api/customer", authMiddleware.requireAuth, customerApi);
app.use("/customers", authMiddleware.requireAuth, customerRoute);
app.use("/employees", authMiddleware.requireAuth, employeeRoute);
app.use("/products", authMiddleware.requireAuth, productRoute);
app.use("/auth", authRoute);
