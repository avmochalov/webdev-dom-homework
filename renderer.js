const comments = document.querySelector('.comments');
import { isLoading, formTextValue, commentsArray, getComment, deleteComment, addLike } from "./api.js";
import { loginFromRenderer } from "./auth-component.js";
import { forms, addCommentAnswerListener, initAddForm, appRenderer } from "./main.js";
let formNameValue = window.localStorage.getItem('name');
function firstAppLoad() {
  comments.innerHTML = `<img class="comments__loader" src="./loader2.gif" alt="loader">`
  getComment().then(() => {
    commentsRenderer();
  })
}
export function commentFromRenderer({ token }) {
  if (!token) {
    forms.innerHTML = `<div class="login-span">Чтобы добавить комментарий, <span class="login-span-link">авторизуйтесь!</span> </div>`
    document.querySelector('.login-span-link').addEventListener('click', () => {
      loginFromRenderer();
    })
  } else {
    formNameValue = window.localStorage.getItem('name');
    forms.innerHTML = `     <div class="add-form">
    <input type="text" disabled class="add-form-name" value = '${formNameValue}' placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4">${formTextValue}</textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="remove-form-button">Удалить последний комментарий</button>
      </div>
      </div>`
  }
}

function commentsUploadRenderer() {
  if (isLoading === false) {
    forms.innerHTML = `<div class="add-form">
    <input type="text" disabled class="add-form-name" value = '${formNameValue}' placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4">${formTextValue}</textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="remove-form-button">Удалить последний комментарий</button>
      </div>
      </div>`
  } else {
    forms.innerHTML = `<img class="loader" src="./loader2.gif" alt="loader">`
    initAddForm();
    addFormButton.disabled = true;
    removeCommentButton.addEventListener('click', removeComment);
    addFormName.addEventListener('input', checkFields);
    addFormText.addEventListener('input', checkFields);
    addFormButton.addEventListener('click', pushComment);
  }

}
function commentsRenderer() {
  console.log(commentsArray);
  const newCommentsSet = commentsArray.map((comment, index) => {
    return `<li class="comment" data-commentid='${index}'>
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment.text}
          </div>
        </div>
        <div class="comment-footer">
          <button class="edit__button" data-edit='${comment.id}'>Удалить</button>
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.isLiked ? '-active-like' : ' '} " data-like='${comment.id}'></button>
          </div>
        </div>
      </li>`

  }).join('');
  comments.innerHTML = newCommentsSet;
  const deleteButtons = document.querySelectorAll('.edit__button');
  // likeEventListener();
  // editEventListener();
  addCommentAnswerListener();
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = deleteButton.dataset.edit;
      deleteComment({ id })
        .then((response) => {
          getComment().then(() => {
            commentsRenderer();
            commentsUploadRenderer();
            initAddForm();
          })
        })
        .catch((error) => {
          alert('Не удалось удалить комментарий');
        });
    })

  }
  const likeButtons = document.querySelectorAll('.like-button');
  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      likeButton.classList.add('loading-like');
      event.stopPropagation();
      const likeId = likeButton.dataset.like;
      console.log(likeId);
      addLike({ likeId })
        .then((response) => {
          getComment().then(() => {
            commentsRenderer();
            commentsUploadRenderer();
            initAddForm();
          })
        })
    })
  }
}
export { commentsUploadRenderer, commentsRenderer, firstAppLoad, comments };