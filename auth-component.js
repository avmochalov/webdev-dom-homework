import { authUser } from "./api.js";
import { forms, setToken, token, appRenderer } from "./main.js"
import { comments } from "./renderer.js"
let formNameValue = String();
export function loginFromRenderer() {
    comments.innerHTML = `<div class="add-form"><input type="text" class="login__input" placeholder="Логин" />
    <br>
    <input type="password" class="pwd__input" placeholder="Пароль" />
    <button class="login-button">Войти</button>
    <button class="reg-button">Зарегистрироваться</button></div>`;
    forms.innerHTML = ``;

    document.querySelector('.login-button').addEventListener('click', () => {
        let login = document.querySelector('.login__input').value;
        let password = document.querySelector('.pwd__input').value;
        authUser({ login: login, password: password }).then((userData) => {
            console.log(userData);
            setToken(`Bearer ${userData.user.token}`);
            formNameValue = `${userData.user.name}`
            console.log(token);
            appRenderer();
        }).catch((error) => {
            alert('Введен неверный логин или пароль');
        })
    })
}
export { formNameValue };