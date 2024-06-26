document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');
    const postContent = document.getElementById('postContent');
    const commentsContainer = document.getElementById('commentsContainer');
    
    // Sample data for posts and comments
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Function to display posts
    function displayPosts() {
        if (postsContainer) {
            postsContainer.innerHTML = '';
            posts.forEach((post, index) => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `<h2>${post.title}</h2><a href="showPost.html?index=${index}">Read More</a>`;
                postsContainer.appendChild(postDiv);
            });
        }
    }

    // Function to display a single post
    function displayPost() {
        if (postContent) {
            const params = new URLSearchParams(window.location.search);
            const index = params.get('index');
            if (index !== null) {
                const post = posts[index];
                postContent.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                displayComments(index);
            }
        }
    }

    // Function to display comments
    function displayComments(postIndex) {
        if (commentsContainer) {
            const comments = posts[postIndex].comments || [];
            commentsContainer.innerHTML = '';
            comments.forEach((comment, index) => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `<p>${comment}</p>`;
                commentsContainer.appendChild(commentDiv);
            });
        }
    }

    // Function to add a new comment
    window.addComment = function() {
        const params = new URLSearchParams(window.location.search);
        const index = params.get('index');
        if (index !== null) {
            const commentText = document.getElementById('commentText').value;
            if (commentText) {
                if (!posts[index].comments) {
                    posts[index].comments = [];
                }
                posts[index].comments.push(commentText);
                localStorage.setItem('posts', JSON.stringify(posts));
                displayComments(index);
                document.getElementById('commentText').value = '';
            } else {
                alert('Please enter a comment.');
            }
        }
    }

    // Function to add a new post
    window.addPost = function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        if (title && content) {
            posts.push({ title, content, comments: [] });
            localStorage.setItem('posts', JSON.stringify(posts));
            window.location.href = 'main.html';
        } else {
            alert('Please enter both title and content.');
        }
    }

    displayPosts();
    displayPost();
});
