import express from "express"
import {addProduct, getAllProduct,updateStock} from "../controllers/products.js"

const router = express.Router()

router.post("/add", addProduct)
router.get("/all", getAllProduct)



router.patch("/:productID/Update", updateStock)

export default router;
