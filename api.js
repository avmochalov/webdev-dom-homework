const api = 'https://webdev-hw-api.vercel.app/api/v1/alex-mochalov/comments';
let commentsArray = [];
let isLoading = false;
let formNameValue = String();
let formTextValue = String();
import date from "./date.js";
import { commentsRenderer, initAddForm } from "./main.js";
import { addFormRenderer } from "./renderer.js";


function getComment() {
    return fetch(api, {
        method: 'GET'
    })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            console.log(responseData);
            commentsArray = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                    likeStatus: ''
                }
            });
        }).catch((error) => {
            alert('Проверьте интернет соединение');
        });
}

function postComment(name, text) {
    fetch(api, {
        method: 'POST',
        body: JSON.stringify({
            forceError: true,
            text: text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                .replaceAll("QUOTE_END", "</div>"),
            name: name
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;"),
        })
    })
        .then((response) => {
            if (response.status === 400) {
                formNameValue = name
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                    .replaceAll("QUOTE_END", "</div>");
                formTextValue = text
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;");
                alert('Значение полей "Имя" и "Текст" должны содержать минимум 3 символа');
                isLoading = false;
                addFormRenderer();
                initAddForm();
            } else if (response.status === 500) {
                formNameValue = name
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                    .replaceAll("QUOTE_END", "</div>");
                formTextValue = text
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;");
                postComment(name, text);
                // alert('Сервер сломался, попробуйте позже!');
            }
            else {
                formNameValue = '';
                formTextValue = '';
                getComment().then(() => {
                    isLoading = false;
                    commentsRenderer();
                    addFormRenderer();
                    initAddForm();
                })
                return response.json();
            }
        })
        .then((responseData) => {
            console.log(responseData);
        }).catch((error) => {
            isLoading = false;
            formNameValue = name
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                .replaceAll("QUOTE_END", "</div>");
            formTextValue = text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;");
            addFormRenderer();
            initAddForm();
            alert('Проверьте интернет соединение');
        });;
}
export { commentsArray, isLoading, formNameValue, formTextValue, getComment, postComment };