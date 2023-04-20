const comments = document.querySelector('.comments');
import { isLoading, formNameValue, formTextValue, commentsArray, getComment } from "./api.js";
import { addForm, likeEventListener, editEventListener, addCommentAnswerListener } from "./main.js";
function firstAppLoad() {
    comments.innerHTML = `<img class="comments__loader" src="./loader2.gif" alt="loader">`
    getComment().then(() => {
        commentsRenderer();
    })
}
function addFormRenderer() {
    if (isLoading === false) {
        addForm.innerHTML = ` <input type="text" class="add-form-name" value = '${formNameValue}' placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4">${formTextValue}</textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="remove-form-button">Удалить последний комментарий</button>
      </div>`
    } else {
        addForm.innerHTML = `<img class="loader" src="./loader2.gif" alt="loader">`
    }
}
function commentsRenderer() {
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
          <button class="edit__button" data-edit='${index}'>Редактировать</button>
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.likeStatus}" data-like='${index}'></button>
          </div>
        </div>
      </li>`

    }).join('');
    comments.innerHTML = newCommentsSet;
    likeEventListener();
    editEventListener();
    addCommentAnswerListener();
}
export { addFormRenderer, commentsRenderer, firstAppLoad, comments };