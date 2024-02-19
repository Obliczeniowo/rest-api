exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                title: 'title',
                content: 'First post ever!'
            }
        ],
    });
}

exports.postPosts = (req, res, next) => {
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            id: new Date().toISOString(),
            ...req.body
        }
    });
}