//HTTP request get,get/id,post,put/id, delete/id
async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json()
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of posts) {
            // Áp dụng strikethrough cho posts đã xóa mềm
            let rowStyle = post.isDeleted ? "text-decoration: line-through; opacity: 0.5;" : "";
            body.innerHTML += `<tr style="${rowStyle}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${post.isDeleted ? '(Deleted)' : ''}</td>
                <td>
                    <input type='submit' value='Edit' onclick='EditPost(${post.id})'/>
                    <input type='submit' value='Delete' onclick='Delete(${post.id})'/>
                </td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }

}//
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    if (id) {
        // Có ID -> Update (PUT)
        let getItem = await fetch("http://localhost:3000/posts/" + id);
        if (getItem.ok) {
            let post = await getItem.json();
            let res = await fetch('http://localhost:3000/posts/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            id: id,
                            title: title,
                            views: views,
                            isDeleted: post.isDeleted || false
                        }
                    )
                })
            if (res.ok) {
                console.log("edit du lieu thanh cong");
            }
        }
    } else {
        // Không có ID -> Tạo mới với auto-increment ID
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        
        // Tìm maxId
        let maxId = 0;
        for (const post of posts) {
            let postId = parseInt(post.id);
            if (postId > maxId) {
                maxId = postId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let createRes = await fetch('http://localhost:3000/posts',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        title: title,
                        views: views,
                        isDeleted: false
                    }
                )
            })
        if (createRes.ok) {
            console.log("them du lieu thanh cong");
        }
    }
    LoadData();

}

async function EditPost(id) {
    let res = await fetch("http://localhost:3000/posts/" + id);
    if (res.ok) {
        let post = await res.json();
        document.getElementById("id_txt").value = post.id;
        document.getElementById("title_txt").value = post.title;
        document.getElementById("view_txt").value = post.views;
    }
}

function ClearForm() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
}

async function Delete(id) {
    // Soft delete: Cập nhật isDeleted = true
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem thanh cong");
        }
    }
    LoadData();
}

// ============ CRUD cho Comments ============

async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let body = document.getElementById("comments-table-body");
        body.innerHTML = "";
        for (const comment of comments) {
            body.innerHTML += `<tr>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>
                    <input type='submit' value='Edit' onclick='EditComment(${comment.id})'/>
                    <input type='submit' value='Delete' onclick='DeleteComment(${comment.id})'/>
                </td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;
    
    if (id) {
        // Có ID -> Update (PUT)
        let getItem = await fetch("http://localhost:3000/comments/" + id);
        if (getItem.ok) {
            let res = await fetch('http://localhost:3000/comments/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            id: id,
                            text: text,
                            postId: postId
                        }
                    )
                })
            if (res.ok) {
                console.log("edit comment thanh cong");
                ClearCommentForm();
            }
        }
    } else {
        // Không có ID -> Tạo mới với auto-increment ID
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        
        // Tìm maxId
        let maxId = 0;
        for (const comment of comments) {
            let commentId = parseInt(comment.id);
            if (commentId > maxId) {
                maxId = commentId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let createRes = await fetch('http://localhost:3000/comments',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        text: text,
                        postId: postId
                    }
                )
            })
        if (createRes.ok) {
            console.log("them comment thanh cong");
            ClearCommentForm();
        }
    }
    LoadComments();
}

async function EditComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id);
    if (res.ok) {
        let comment = await res.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_text_txt").value = comment.text;
        document.getElementById("comment_postId_txt").value = comment.postId;
    }
}

async function DeleteComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id, {
        method: 'DELETE'
    });
    if (res.ok) {
        console.log("xoa comment thanh cong");
    }
    LoadComments();
}

function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
}

LoadData();
LoadComments();
