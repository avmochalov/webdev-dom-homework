import { regUser } from "./api.js";
import { loginFromRenderer } from "./auth-component.js";
import { forms } from "./main.js"
import { comments } from "./renderer.js"

export function regFromRenderer() {
    comments.innerHTML = `<div class="add-form">
    <input type="text" class="name__input" placeholder="Имя" />
    <br>
    <input type="text" class="login__input" placeholder="Логин" />
    <br>
    <input type="password" class="pwd__input" placeholder="Пароль"/>
    <button class="login-button">Зарегистрироваться</button>
    </div>`;
    forms.innerHTML = ``;
    document.querySelector('.login-button').addEventListener('click', () => {
        let name = document.querySelector('.name__input').value;
        let login = document.querySelector('.login__input').value;
        let password = document.querySelector('.pwd__input').value;
        if (!name || !login || !password) {
            alert('Заполните все поля');
        } else {
            regUser({ login: login, name: name, password: password }).then((regResult) => {
                console.log(regResult);
                comments.innerHTML = `<div class="add-form">
                <img src="./check.png" alt="" class="reg_img">
                <div class="reg-status">Регистрация прошла успешно!</div>
                </div>`
                setTimeout(loginFromRenderer, 3000);
            })
                .catch((error) => {
                    alert('Такой пользователь уже существует')
                });
        }

    })
}