const Category = require('../models/Category');
const Post = require('../models/Post');

exports.getAllCategories = (req, res) => {
    Category.findAll((err, categories) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(categories);
    });
};

exports.getCategoryById = (req, res) => {
    const categoryId = req.params.category_id;
    Category.findById(categoryId, (err, category) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    });
};

exports.getPostsByCategoryId = (req, res) => {
    const categoryId = req.params.category_id;
    Post.findAllByCategoryId(categoryId, (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};

exports.createCategory = (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    Category.create(title, description, (err, categoryId) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Category created', categoryId });
    });
};

exports.updateCategory = (req, res) => {
    const categoryId = req.params.category_id;
    const { title, description } = req.body;

    Category.updateById(categoryId, title, description, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result === 0) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated' });
    });
};

exports.deleteCategory = (req, res) => {
    const categoryId = req.params.category_id;
    Category.deleteById(categoryId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result === 0) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    });
};
