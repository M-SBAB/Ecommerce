import Product from '../models/products.js';

export const addProduct = async (req, res) => {
  try {
    const { productName, category, price, quantity, description } = req.body;
    const newAddProduct = new Product({
      productName: productName,
      category,
      price,
      quantity,
      description,
    });
    await newAddProduct.save();
    res.status(201).json({ message: 'Product Added!' });
    // res.json({productName, category, price, quantity, description})
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    // Get query parameters for search/filter
    const { search, category, minPrice, maxPrice, page, limit } = req.query;

    // Build filter object
    let filter = {};

    // Search by product name (case-insensitive)
    if (search) {
      filter.productName = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    // Get products with pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!products) {
      return res.json({ ErrorMessage: 'No products' });
    }

    res.status(200).json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
        totalProducts,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: 'Error getting all products!' });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { productID } = req.params;
    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({ ErrorMessage: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ ErrorMessage: 'Error getting product!' });
  }
};

// Update product (full update) - all fields can be updated
export const updateProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const { productName, category, price, quantity, description } = req.body;

    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({ ErrorMessage: 'Product not found' });
    }

    // Update only provided fields
    const updateFields = {};
    if (productName) updateFields.productName = productName;
    if (category) updateFields.category = category;
    if (price) updateFields.price = price;
    if (quantity !== undefined) updateFields.quantity = quantity;
    if (description) updateFields.description = description;

    const updatedProduct = await Product.findByIdAndUpdate(
      productID,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Update product stock with operation types (add/remove/set)
export const updateStock = async (req, res) => {
  try {
    const { productID } = req.params;
    const { stock, operation } = req.body;
    const product = await Product.findOne({ _id: productID });

    if (!product)
      return res.status(404).json({ ErrorMessage: 'Product not found' });

    const currentQuantity = product.quantity;
    let updatedQuantity;

    // Handle different operation types
    switch (operation) {
      case 'add':
        updatedQuantity = currentQuantity + Number(stock);
        break;
      case 'remove':
        updatedQuantity = currentQuantity - Number(stock);
        if (updatedQuantity < 0) {
          return res.status(400).json({
            ErrorMessage: `Cannot remove ${stock} units. Only ${currentQuantity} units available.`,
          });
        }
        break;
      case 'set':
        updatedQuantity = Number(stock);
        break;
      default:
        return res.status(400).json({
          ErrorMessage: 'Invalid operation. Use "add", "remove", or "set".',
        });
    }

    await Product.findByIdAndUpdate(
      productID,
      { quantity: updatedQuantity },
      { new: true }
    );

    res.status(200).json({
      message: `Stock ${
        operation === 'add'
          ? 'added'
          : operation === 'remove'
          ? 'removed'
          : 'set'
      } successfully! New quantity: ${updatedQuantity}`,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    const product = await Product.findById(productID);

    if (!product) {
      return res.status(404).json({ ErrorMessage: 'Product not found' });
    }

    await Product.findByIdAndDelete(productID);

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};
