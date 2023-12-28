class AuthHandler {
    handle() {
        const loginInput = document.querySelector("#loginInput");
        const passwordInput = document.querySelector("#passwordInput");
        const submitButton = document.querySelector("#submitButton");
        loginInput.focus();

        submitButton.onclick = () => {
            if (loginInput.value === "" || passwordInput.value === "") {
                app.startLoadAnimation(".5s", "linear", () => {
                    const errorBanner = document.querySelector("#authErrBanner");
                    errorBanner.classList.remove("login-form__err_hidden");
                });
            } else {
                document.cookie = `remember-me=token`
                app.currentPage = app.Pages.MAIN;
                app.refresh();
            }
        }

        document.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                submitButton.click();
            }
        })
    }
}