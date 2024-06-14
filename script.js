// Function to add a post
function addPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (title === '' || content === '') {
        alert('Please fill in both fields.');
        return;
    }

    const post = {
        title: title,
        content: content,
        id: new Date().getTime()
    };

    let posts = localStorage.getItem('posts');
    if (posts) {
        posts = JSON.parse(posts);
    } else {
        posts = [];
    }

    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';

    displayPosts();
}

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    let posts = localStorage.getItem('posts');
    if (posts) {
        posts = JSON.parse(posts);
    } else {
        posts = [];
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-content">${post.content}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Initial display of posts
displayPosts();
