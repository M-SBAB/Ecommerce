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
    const { search, category, minPrice, maxPrice } = req.query;

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

    const products = await Product.find(filter);
    if (!products) {
      return res.json({ ErrorMessage: 'No products' });
    }
    res.status(200).json({ products });
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

    res
      .status(200)
      .json({
        message: 'Product updated successfully!',
        product: updatedProduct,
      });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Update product stock (add to existing stock)
export const updateStock = async (req, res) => {
  try {
    const { productID } = req.params;
    const { stock } = req.body;
    const product = await Product.findOne({ _id: productID });

    if (!product)
      return res.status(404).json({ ErrorMessage: 'Product not found' });

    const quantity = product.quantity;

    const updatedQuantity = quantity + Number(stock);
    await Product.findByIdAndUpdate(
      productID,
      { quantity: updatedQuantity },
      { new: true }
    );

    res.status(201).json({ message: 'Stock updated!' });

    // res.json({productID, stock})
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
