document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');
    const postContent = document.getElementById('postContent');
    const commentsContainer = document.getElementById('commentsContainer');

    // Function to fetch and display posts
    async function fetchPosts() {
        const response = await fetch('https://dk.ccsso.shop/posts');
        const posts = await response.json();
        if (postsContainer) {
            postsContainer.innerHTML = '';
            posts.forEach((post) => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                const utcDate = new Date(post.created_at + 'Z'); // UTC 시간으로 파싱
                const formattedDate = utcDate.toLocaleDateString("ko-KR", {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul'
                });  // 날짜와 시간을 포함하여 형식 지정
                postDiv.innerHTML = `
                    <a href="showPost.html?id=${post._id}">
                        <h2>${post.title}</h2>
                        <p>${formattedDate}</p>
                    </a>`;
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
                const response = await fetch(`https://dk.ccsso.shop/posts/${id}`);
                const post = await response.json();
                postContent.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                fetchComments(id);
            }
        }
    }

    // Function to fetch and display comments for a specific post
    async function fetchComments(postId) {
        if (commentsContainer) {
            const response = await fetch(`https://dk.ccsso.shop/posts/${postId}/comments`);
            const comments = await response.json();
            commentsContainer.innerHTML = '';
            comments.forEach((comment, index) => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.innerHTML = `<p>익명 댓글 ${index+1}: ${comment.content}</p>`;
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
                const response = await fetch(`https://dk.ccsso.shop/posts/${postId}/comments`, {
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
            const response = await fetch('https://dk.ccsso.shop/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, content: content })
            });
            if (response.ok) {
                window.location.href = 'board.html'; // Redirect to main page after post creation
            }
        } else {
            alert('Please enter both title and content!');
        }
    }

    fetchPosts();
    fetchPost();
});
