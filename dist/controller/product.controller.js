"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.addReview = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const product_model_1 = __importDefault(require("../model/product.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, imageUrl } = req.body;
    if (!title || !description || !price) {
        return res
            .status(400)
            .json({ error: "All fields are required, including image details." });
    }
    try {
        let thumb = {
            url: "https://res.cloudinary.com/de2xhx2wy/image/upload/v1725597823/courses/i5gcvuunwphhbkakvfpq.png",
            public_id: "courses/i5gcvuunwphhbkakvfpq",
        };
        if (imageUrl) {
            try {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(imageUrl, {
                    folder: "courses",
                });
                thumb = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            catch (error) {
                console.error("Error uploading image:", error);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }
        const newProduct = yield product_model_1.default.create({
            title,
            description,
            price,
            imageUrl: thumb,
        });
        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product: newProduct,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while adding the product. Please try again later.",
        });
    }
});
exports.addProduct = addProduct;
// Get all products
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find({});
        res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while retrieving products. Please try again later.",
        });
    }
});
exports.getAllProducts = getAllProducts;
// Get a specific product by ID
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while retrieving the product. Please try again later.",
        });
    }
});
exports.getProductById = getProductById;
// Update a product by ID
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, price, imageUrl } = req.body;
    try {
        let updatedImage = null;
        if (imageUrl) {
            try {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(imageUrl, {
                    folder: "courses",
                });
                updatedImage = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            catch (error) {
                console.error("Error uploading image:", error);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, {
            title,
            description,
            price,
            imageUrl: updatedImage || undefined,
        }, { new: true } // Return the updated document
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while updating the product. Please try again later.",
        });
    }
});
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        // Optionally delete the image from Cloudinary
        // if (product.imageUrl?.public_id) {
        //   try {
        //     await cloudinary.v2.uploader.destroy(product.imageUrl.public_id);
        //   } catch (error) {
        //     console.error("Error deleting image from Cloudinary:", error);
        //   }
        // }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while deleting the product. Please try again later.",
        });
    }
});
exports.deleteProduct = deleteProduct;
// Add or update a product review
const addReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, rating, review } = req.body;
    if (!productId || rating === undefined || !userId) {
        return res
            .status(400)
            .json({ error: "Product ID, rating, and user ID are required." });
    }
    try {
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        const existingReviewIndex = product.ratings.findIndex((r) => r.userId.equals(userId));
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        if (existingReviewIndex > -1) {
            product.ratings[existingReviewIndex] = {
                userId: userObjectId,
                rating,
                review,
            };
        }
        else {
            product.ratings.push({ userId: userObjectId, rating, review });
        }
        yield product.save();
        return res.status(200).json({
            success: true,
            message: "Review added/updated successfully.",
            product,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while adding the review." });
    }
});
exports.addReview = addReview;
// Get reviews for a product
const getReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ error: "Product ID is required." });
    }
    try {
        const product = yield product_model_1.default.findById(productId).select("ratings");
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        return res.status(200).json({
            success: true,
            reviews: product.ratings,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while retrieving reviews." });
    }
});
exports.getReviews = getReviews;
