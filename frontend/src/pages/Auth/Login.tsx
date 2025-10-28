import "./Login.scss";

export default function Login() {
    return (
        <div className="container">
            <h2>Добро пожаловать!</h2>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Пароль" />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}