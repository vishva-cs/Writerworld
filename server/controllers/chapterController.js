const Chapter = require('../models/Chapter');
const Book = require('../models/Book');

// @desc      Create chapter
// @route     POST /api/chapters
// @access    Private
exports.createChapter = async (req, res) => {
  try {
    const { title, chapterNumber, bookId, content } = req.body;

    if (!title || !bookId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields',
      });
    }

    // Check book exists and user is author
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add chapters to this book',
      });
    }

    const chapter = new Chapter({
      title,
      chapterNumber: chapterNumber || book.chapters.length + 1,
      book: bookId,
      content,
    });

    chapter.calculateReadTime();
    await chapter.save();

    // Add chapter to book
    book.chapters.push(chapter._id);
    book.wordCount = (book.wordCount || 0) + chapter.wordCount;
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create chapter',
      error: error.message,
    });
  }
};

// @desc      Get chapter
// @route     GET /api/chapters/:id
// @access    Public
exports.getChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('book', 'title author')
      .populate('comments');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapter',
      error: error.message,
    });
  }
};

// @desc      Update chapter
// @route     PUT /api/chapters/:id
// @access    Private
exports.updateChapter = async (req, res) => {
  try {
    let chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Check authorization
    const book = await Book.findById(chapter.book);
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this chapter',
      });
    }

    chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    chapter.calculateReadTime();
    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update chapter',
      error: error.message,
    });
  }
};

// @desc      Delete chapter
// @route     DELETE /api/chapters/:id
// @access    Private
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Check authorization
    const book = await Book.findById(chapter.book);
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this chapter',
      });
    }

    // Remove from book
    await Book.findByIdAndUpdate(
      chapter.book,
      { $pull: { chapters: req.params.id } }
    );

    await Chapter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Chapter deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete chapter',
      error: error.message,
    });
  }
};

// @desc      Like chapter
// @route     POST /api/chapters/:id/like
// @access    Private
exports.likeChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    if (chapter.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Chapter already liked',
      });
    }

    chapter.likes.push(req.user._id);
    chapter.likeCount += 1;
    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Chapter liked',
      likeCount: chapter.likeCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to like chapter',
      error: error.message,
    });
  }
};

// @desc      Unlike chapter
// @route     DELETE /api/chapters/:id/like
// @access    Private
exports.unlikeChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    chapter.likes = chapter.likes.filter(id => id.toString() !== req.user._id.toString());
    chapter.likeCount = Math.max(0, chapter.likeCount - 1);
    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Chapter unliked',
      likeCount: chapter.likeCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unlike chapter',
      error: error.message,
    });
  }
};

// @desc      Auto-save chapter
// @route     POST /api/chapters/:id/auto-save
// @access    Private
exports.autoSaveChapter = async (req, res) => {
  try {
    const { content } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      {
        autoSaveContent: content,
        autoSaveTime: new Date(),
        isAutoSaved: true,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Chapter auto-saved',
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to auto-save chapter',
      error: error.message,
    });
  }
};

// @desc      Publish chapter
// @route     POST /api/chapters/:id/publish
// @access    Private
exports.publishChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Check authorization
    const book = await Book.findById(chapter.book);
    if (book.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this chapter',
      });
    }

    chapter.isPublished = true;
    chapter.publishedAt = new Date();
    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Chapter published',
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish chapter',
      error: error.message,
    });
  }
};
