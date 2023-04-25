const api = 'https://webdev-hw-api.vercel.app/api/v2/alex-mochalov/comments';
const authApi = 'https://webdev-hw-api.vercel.app/api/user';
let commentsArray = [];
let isLoading = false;
let formTextValue = String();
import date from "./date.js";
import { commentsRenderer, initAddForm, token } from "./main.js";
import { commentsUploadRenderer } from "./renderer.js";


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

function postComment(text) {
    fetch(api, {
        method: 'POST',
        body: JSON.stringify({
            forceError: true,
            text: text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                .replaceAll("QUOTE_END", "</div>"),
        }),
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 400) {
                formTextValue = text
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;");
                alert('Значение полей "Имя" и "Текст" должны содержать минимум 3 символа');
                isLoading = false;
                commentsUploadRenderer();
                initAddForm();
            } else if (response.status === 500) {
                formTextValue = text
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;");
                postComment(text);
                // alert('Сервер сломался, попробуйте позже!');
            }
            else {
                formTextValue = '';
                getComment().then(() => {
                    isLoading = false;
                    commentsRenderer();
                    commentsUploadRenderer();
                    initAddForm();
                })
                return response.json();
            }
        })
        .then((responseData) => {
            console.log(responseData);
        }).catch((error) => {
            isLoading = false;
            formTextValue = text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;");
            commentsUploadRenderer();
            initAddForm();
            alert('Проверьте интернет соединение');
        });;
}

export function authUser({ login, password }) {
    return fetch(`${authApi}/login`, {
        method: 'POST',
        body: JSON.stringify({
            login,
            password
        })
    })
        .then((response) => {
            return response.json();
        })
}

export function regUser({ login, name, password }) {
    return fetch(authApi, {
        method: 'POST',
        body: JSON.stringify({
            login,
            name,
            password
        })
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('400');
            }
            return response.json();
        })
}
export { commentsArray, isLoading, formTextValue, getComment, postComment };