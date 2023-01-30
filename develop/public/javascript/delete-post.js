async function deleteFormHandler(event) {
    event.preventDefault();
    
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

    const deleteComment = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          comment_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (deleteComment.ok) {
        if (response.ok) {
          document.location.replace('/dashboard/');
        }
      } else {
        alert(response.statusText);
        alert(deleteComment.statusText);
      }
  }
  
  document.querySelector('.delete-btn').addEventListener('click', deleteFormHandler);