const Post = require('../lib/mongo').Post
const marked = require('marked')
const CommentModel = require('../models/comments')

Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount
        return post
      })
    }
    return post
  }
})

Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post.content) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  create: function create (post) {
    return Post.create(post).exec()
  },
  getPostById: function getPostById (postId) {
    return Post.findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 根据创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: function getPosts (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 通过文章id给pv加1
  incPv: function incPv (postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec()
  },
  // 通过文章id获取一篇原生文章
  getRawPostById: function getRawPostById (postId) {
    return Post.findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },
  // 通过文章id更新一篇文章
  updatePostById: function updatePostById (postId, data) {
    return Post.update({ _id: postId }, { $set: data }).exec()
  },
  delPostById: function delPostById (postId) {
    return Post.deleteOne({ _id: postId }).exec().then(function (res) {
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.delCommentById(postId)
      }
    })
  }
}
