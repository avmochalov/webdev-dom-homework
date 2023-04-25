import { authUser } from "./api.js";
import { forms, setToken, token, appRenderer } from "./main.js"
import { regFromRenderer } from "./reg-component.js";
import { comments } from "./renderer.js"
export function loginFromRenderer() {
    window.scrollTo(0, 0);
    comments.innerHTML = `<div class="add-form"><input type="text" class="login__input" placeholder="Логин" />
    <br>
    <input type="password" class="pwd__input" placeholder="Пароль" />
    <button class="login-button">Войти</button>
    <button class="reg-button">Зарегистрироваться</button></div>`;
    forms.innerHTML = ``;
    document.querySelector('.reg-button').addEventListener('click', () => {
        regFromRenderer();
    });
    document.querySelector('.login-button').addEventListener('click', () => {
        let login = document.querySelector('.login__input').value;
        let password = document.querySelector('.pwd__input').value;
        authUser({ login: login, password: password }).then((userData) => {
            console.log(userData);
            setToken(`Bearer ${userData.user.token}`);
            window.localStorage.setItem('name', `${userData.user.name}`)
            console.log(token);
            appRenderer();
        })
            .catch((error) => {
                alert('Введен неверный логин или пароль');
            })
    })
}