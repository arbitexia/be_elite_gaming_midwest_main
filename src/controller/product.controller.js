import { productService } from '@/services';

export const getProducts = async (req, res) => {
  try {
    const { filterBy, cursor } = req.query;
    const result = await productService.loadProducts(filterBy, cursor);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.getOne(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { input } = req.body;
    const result = await productService.createProduct(input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    const result = await productService.updateProduct(id, input);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
