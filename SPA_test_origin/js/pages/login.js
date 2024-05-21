//로그인 페이지의 콘텐츠와 로직을 포함합니다.

const loginPage = `
    <div>
        <h1>Login Page</h1>
        <form id="login-form">
            <input type="text" placeholder="Username" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <button data-link="mode_select">Go to Mode Select</button>
    </div>
`;

export default loginPage;
