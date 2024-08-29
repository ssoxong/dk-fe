document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');
    const postContent = document.getElementById('postContent');
    const commentsContainer = document.getElementById('commentsContainer');

    // Function to fetch and display posts
    async function fetchPosts() {
        const response = await fetch('http://localhost:8000/posts');
        const posts = await response.json();
        if (postsContainer) {
            postsContainer.innerHTML = '';
            posts.forEach((post, index) => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `<a href="showPost.html?id=${post.id}"><h2>${post.title}</h2></a>`;
                postsContainer.appendChild(postDiv);
            });
        }
    }

    // Function to fetch and display a single post and its comments
    async function fetchPost() {
        if (postContent) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id !== null) {
                const response = await fetch(`http://localhost:8000/posts/${id}`);
                const post = await response.json();
                postContent.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                fetchComments(id);
            }
        }
    }

    // Function to fetch and display comments for a specific post
    async function fetchComments(postId) {
        if (commentsContainer) {
            const response = await fetch(`http://localhost:8000/posts/${postId}/comments`);
            const comments = await response.json();
            commentsContainer.innerHTML = '';
            comments.forEach((comment, index) => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `<p>익명 ${index+1}: ${comment.content}</p>`;
                commentsContainer.appendChild(commentDiv);
            });
        }
    }

    // Function to add a new comment to a post
    window.addComment = async function() {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        if (postId !== null) {
            const commentText = document.getElementById('commentText').value;
            if (commentText) {
                const response = await fetch(`http://localhost:8000/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: commentText })
                });
                if (response.ok) {
                    fetchComments(postId);
                    document.getElementById('commentText').value = '';
                }
            } else {
                alert('Please enter a comment.');
            }
        }
    }

    // Function to add a new post
    window.addPost = async function() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        if (title && content) {
            const response = await fetch('http://localhost:8000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, content: content })
            });
            if (response.ok) {
                window.location.href = 'main.html'; // Redirect to main page after post creation
            }
        } else {
            alert('Please enter both title and content.');
        }
    }

    fetchPosts();
    fetchPost();
});
