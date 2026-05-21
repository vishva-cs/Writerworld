const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const User = require('../models/User');

// @desc      Get all books
// @route     GET /api/books
// @access    Public
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, language } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublished: true, status: 'published' };

    if (category) query.category = category;
    if (language) query.language = language;

    const books = await Book.find(query)
      .populate('author', 'username profileImage bio')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message,
    });
  }
};

// @desc      Get trending books
// @route     GET /api/books/trending
// @access    Public
exports.getTrendingBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublished: true, status: 'published' })
      .populate('author', 'username profileImage')
      .sort({ trendingScore: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending books',
      error: error.message,
    });
  }
};

// @desc      Get featured books
// @route     GET /api/books/featured
// @access    Public
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublished: true, status: 'published' })
      .populate('author', 'username profileImage')
      .sort({ 'rating.average': -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured books',
      error: error.message,
    });
  }
};

// @desc      Get single book
// @route     GET /api/books/:id
// @access    Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username profileImage bio followers following')
      .populate('chapters')
      .populate('comments');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message,
    });
  }
};

// @desc      Get book chapters
// @route     GET /api/books/:id/chapters
// @access    Public
exports.getBookChapters = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const chapters = await Chapter.find({ book: id })
      .select('title chapterNumber wordCount readTime isPublished publishedAt')
      .sort({ chapterNumber: 1 })
      .limit(limit)
      .skip(skip);

    const total = await Chapter.countDocuments({ book: id });

    res.status(200).json({
      success: true,
      count: chapters.length,
      total,
      pages: Math.ceil(total / limit),
      chapters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapters',
      error: error.message,
    });
  }
};

// @desc      Create book
// @route     POST /api/books
// @access    Private
exports.createBook = async (req, res) => {
  try {
    const { title, description, category, language, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    const book = new Book({
      title,
      description,
      category: category || 'other',
      language: language || 'en',
      author: req.user._id,
      tags: tags || [],
    });

    await book.save();

    // Add book to user's books
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { books: book._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message,
    });
  }
};

// @desc      Update book
// @route     PUT /api/books/:id
// @access    Private
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check authorization
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message,
    });
  }
};

// @desc      Delete book
// @route     DELETE /api/books/:id
// @access    Private
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check authorization
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }

    // Delete chapters
    await Chapter.deleteMany({ book: req.params.id });

    // Delete book
    await Book.findByIdAndDelete(req.params.id);

    // Remove from user's books
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { books: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message,
    });
  }
};

// @desc      Publish book
// @route     POST /api/books/:id/publish
// @access    Private
exports.publishBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check authorization
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this book',
      });
    }

    // Check if book has chapters
    const chapters = await Chapter.find({ book: req.params.id });
    if (chapters.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Book must have at least one chapter to publish',
      });
    }

    book.isPublished = true;
    book.status = 'published';
    book.publishedAt = new Date();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book published successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish book',
      error: error.message,
    });
  }
};

// @desc      Like book
// @route     POST /api/books/:id/like
// @access    Private
exports.likeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if already liked
    if (book.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Book already liked',
      });
    }

    book.likes.push(req.user._id);
    book.likeCount += 1;
    book.updateTrendingScore();
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book liked',
      likeCount: book.likeCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to like book',
      error: error.message,
    });
  }
};

// @desc      Unlike book
// @route     DELETE /api/books/:id/like
// @access    Private
exports.unlikeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    book.likes = book.likes.filter(id => id.toString() !== req.user._id.toString());
    book.likeCount = Math.max(0, book.likeCount - 1);
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book unliked',
      likeCount: book.likeCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unlike book',
      error: error.message,
    });
  }
};

// @desc      Bookmark book
// @route     POST /api/books/:id/bookmark
// @access    Private
exports.bookmarkBook = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.bookmarks.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Book already bookmarked',
      });
    }

    user.bookmarks.push(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book bookmarked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bookmark book',
      error: error.message,
    });
  }
};

// @desc      Remove bookmark
// @route     DELETE /api/books/:id/bookmark
// @access    Private
exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { bookmarks: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bookmark removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark',
      error: error.message,
    });
  }
};
