const User = require('../models/User');
const Book = require('../models/Book');

// @desc      Get all writers
// @route     GET /api/writers
// @access    Public
exports.getAllWriters = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const writers = await User.find({ isActive: true })
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: writers.length,
      total,
      pages: Math.ceil(total / limit),
      writers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch writers',
      error: error.message,
    });
  }
};

// @desc      Get trending writers
// @route     GET /api/writers/trending
// @access    Public
exports.getTrendingWriters = async (req, res) => {
  try {
    const writers = await User.find({ isActive: true })
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .sort({ followers: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: writers.length,
      writers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending writers',
      error: error.message,
    });
  }
};

// @desc      Get writer profile
// @route     GET /api/writers/:id
// @access    Public
exports.getWriterProfile = async (req, res) => {
  try {
    const writer = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage')
      .populate('books');

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found',
      });
    }

    res.status(200).json({
      success: true,
      writer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch writer profile',
      error: error.message,
    });
  }
};

// @desc      Get writer books
// @route     GET /api/writers/:id/books
// @access    Public
exports.getWriterBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const books = await Book.find({
      author: req.params.id,
      isPublished: true,
      status: 'published',
    })
      .populate('author', 'username profileImage')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments({
      author: req.params.id,
      isPublished: true,
      status: 'published',
    });

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch writer books',
      error: error.message,
    });
  }
};

// @desc      Get writer stats
// @route     GET /api/writers/:id/stats
// @access    Public
exports.getWriterStats = async (req, res) => {
  try {
    const writer = await User.findById(req.params.id);

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found',
      });
    }

    const books = await Book.find({ author: req.params.id });
    const totalViews = books.reduce((sum, book) => sum + book.views, 0);
    const totalLikes = books.reduce((sum, book) => sum + book.likeCount, 0);
    const totalComments = books.reduce((sum, book) => sum + book.commentCount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalBooks: books.length,
        publishedBooks: books.filter(b => b.isPublished).length,
        totalViews,
        totalLikes,
        totalComments,
        followers: writer.followers.length,
        following: writer.following.length,
        memberSince: writer.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch writer stats',
      error: error.message,
    });
  }
};

// @desc      Follow writer
// @route     POST /api/writers/:id/follow
// @access    Private
exports.followWriter = async (req, res) => {
  try {
    const writer = await User.findById(req.params.id);

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found',
      });
    }

    // Check if already following
    if (writer.followers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this writer',
      });
    }

    // Add follower
    writer.followers.push(req.user._id);
    await writer.save();

    // Add to following
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Writer followed successfully',
      followers: writer.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to follow writer',
      error: error.message,
    });
  }
};

// @desc      Unfollow writer
// @route     DELETE /api/writers/:id/follow
// @access    Private
exports.unfollowWriter = async (req, res) => {
  try {
    const writer = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Writer unfollowed successfully',
      followers: writer.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow writer',
      error: error.message,
    });
  }
};

// @desc      Get followers
// @route     GET /api/writers/:id/followers
// @access    Public
exports.getFollowers = async (req, res) => {
  try {
    const writer = await User.findById(req.params.id)
      .populate('followers', 'username profileImage bio');

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found',
      });
    }

    res.status(200).json({
      success: true,
      count: writer.followers.length,
      followers: writer.followers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch followers',
      error: error.message,
    });
  }
};

// @desc      Get following
// @route     GET /api/writers/:id/following
// @access    Public
exports.getFollowing = async (req, res) => {
  try {
    const writer = await User.findById(req.params.id)
      .populate('following', 'username profileImage bio');

    if (!writer) {
      return res.status(404).json({
        success: false,
        message: 'Writer not found',
      });
    }

    res.status(200).json({
      success: true,
      count: writer.following.length,
      following: writer.following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch following',
      error: error.message,
    });
  }
};
