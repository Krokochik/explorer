class AuthHandler {
    handle() {
        document.querySelector("#submitButton").onclick = () => {
            const loginInput = document.querySelector("#loginInput");
            const passwordInput = document.querySelector("#passwordInput");
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
    }
}