let addFormButton;
let removeCommentButton;
let addFormName;
let addFormText;
const forms = document.querySelector('.forms');
const appHtml = document.querySelector('.add-form');
let token = window.localStorage.getItem('token');
console.log(token);
firstAppLoad();

import { commentsUploadRenderer, commentsRenderer, comments, firstAppLoad, commentFromRenderer } from "./renderer.js";
import { getComment, postComment, commentsArray, isLoading, formTextValue } from "./api.js";
import { loginFromRenderer } from "./auth-component.js";

appRenderer();
function setToken(newToken) {
    window.localStorage.setItem('token', `${newToken}`)
    token = window.localStorage.getItem('token');
    console.log(token);
}
function appRenderer() {
    if (!token) {
        getComment().then(() => {
            commentsRenderer();
            commentFromRenderer({ token });
        });
    } else {
        comments.innerHTML = `<img class="comments__loader" src="./loader2.gif" alt="loader">`;
        getComment().then(() => {
            commentsRenderer();
            commentFromRenderer({ token });
            initAddForm();
        });

    }
}
function delay(interval = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}
function fixEditField() {
    const editField = document.querySelector('.change-form-text');
    editField.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}
function addCommentAnswerListener() {
    const commentsList = document.querySelectorAll('.comment');
    for (const comment of commentsList) {
        comment.addEventListener('click', () => {
            const commentIndex = comment.dataset.commentid;
            addFormText.value = `QUOTE_BEGIN ${commentsArray[commentIndex].name}  \n  ${commentsArray[commentIndex].text} QUOTE_END`;
        });
    }
}
function saveEventListener() {
    const textArea = document.querySelector('.change-form-text');
    const saveButton = document.querySelector('.save__button');
    saveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const buttonIndex = saveButton.dataset.save;
        commentsArray[buttonIndex].text = textArea.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
        commentsRenderer();
    })
}
function editEventListener() {
    const editButtons = document.querySelectorAll('.edit__button');
    for (const editButton of editButtons) {
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const buttonIndex = editButton.dataset.edit;
            const newCommentsSet = commentsArray.map((comment, index) => {
                if (Number(buttonIndex) === index) {
                    return `<li class="comment" data-commentid='${index}'>
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <textarea type="textarea" class="change-form-text" rows="4">${comment.text}</textarea>
        </div>
        <div class="comment-footer">
          <button class="save__button" data-save='${index}'>Сохранить</button>
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button" data-like='${index}'></button>
          </div>
        </div>
      </li>`
                } else {
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
            <button class="like-button" data-like='${index}'></button>
          </div>
        </div>
      </li>`
                }
            }).join('');
            comments.innerHTML = newCommentsSet;
            fixEditField();
            saveEventListener();
            addCommentAnswerListener();
        });
    }
}
// function likeEventListener() {
//     const likeButtons = document.querySelectorAll('.like-button');
//     for (const likeButton of likeButtons) {
//         likeButton.addEventListener('click', (event) => {
//             console.log(event);
//             event.stopPropagation();
//             const buttonIndex = likeButton.dataset.like;
//             likeButton.classList.add('loading-like');
//             console.log(likeButton);
//             delay().then(() => {
//                 if (commentsArray[buttonIndex].isLiked === false) {
//                     commentsArray[buttonIndex].likeStatus = '-active-like';
//                     commentsArray[buttonIndex].likes = ++commentsArray[buttonIndex].likes;
//                 } else {
//                     commentsArray[buttonIndex].likeStatus = '';
//                     commentsArray[buttonIndex].likes = --commentsArray[buttonIndex].likes;
//                 }
//                 commentsRenderer();
//             })

//         });
//     }

// }
function checkFields() {
    (addFormName.value.trim() != '' && addFormText.value.trim() != '') ? addFormButton.disabled = false : addFormButton.disabled = true;  //Добавил удаление пробелов, чтобы пользователь не мог отправить сообщение из пробелов

}
function pushComment() {
    if (addFormName.value === '' || addFormText.value === '') {
        return;
    } else {
        forms.innerHTML = `<img class="loader" src="./loader2.gif" alt="loader">`
        console.log(isLoading);
        postComment(addFormText.value);

        addFormText.value = '';
        addFormName.value = '';
        addFormButton.disabled = true;
    }
    commentsRenderer();
}
function removeComment() {
    if (comments.children.length <= 1) {
        return;
    } else {
        comments.lastElementChild.remove();
    }
}
function initAddForm() {
    addFormButton = document.querySelector('.add-form-button');
    addFormName = document.querySelector('.add-form-name');
    addFormText = document.querySelector('.add-form-text');
    removeCommentButton = document.querySelector('.remove-form-button');
    addFormButton.disabled = true;
    console.log(addFormButton);
    addFormName.addEventListener('input', checkFields);
    addFormText.addEventListener('input', checkFields);
    addFormButton.addEventListener('click', pushComment);
    removeCommentButton.addEventListener('click', () => {
        window.localStorage.clear();
        location.reload();
    });
    (addFormName.value.trim().length != 0 && addFormText.value.trim().length != 0) ? addFormButton.disabled = false : addFormButton.disabled = true;
}
document.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        pushComment();
    }
});
export { setToken, token, appRenderer, commentsRenderer, commentsUploadRenderer, initAddForm, forms, addCommentAnswerListener };