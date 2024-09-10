"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./router/user.route"));
const error_1 = require("./middleware/error");
const product_route_1 = __importDefault(require("./router/product.route"));
const cart_route_1 = __importDefault(require("./router/cart.route"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
// Routes
app.use("/api/v1", user_route_1.default, product_route_1.default, cart_route_1.default);
app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});
// unknown route
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
// Global Error Handler
app.use(error_1.ErrorMiddleware);
exports.default = app;
