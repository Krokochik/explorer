class App {
    Pages = Object.freeze({
        AUTH: {name: "auth", template: "templates/login-form.html", handler: AuthHandler},
        MAIN: {name: "main", template: "templates/main.html", handler: MainHandler}
    })

    currentPage;
    currentHandler;
    ran = false;
    rows = [];

    getCookie(cookieName) {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    }

    loadFromHtml(html, onReady) {
        const xhr= new XMLHttpRequest();
        xhr.open("GET", html, true);
        const ctx = this;
        xhr.onreadystatechange= function() {
            if (this.readyState!==4) return;
            if (this.status!==200) return; // or whatever error handling you want
            document.getElementById("app").innerHTML= this.responseText;
            onReady();
        };
        xhr.send();
    }

    startLoadAnimation(duration, timing, onAnimationEnd) {
        const loader = document.querySelector("#loader");
        loader.classList.remove("window__loader_active");
        loader.offsetWidth; // styles recalculation
        loader.style.animationDuration = duration + "," + duration;
        if (timing === "default") {
            loader.style.animationTimingFunction = "";
        } else {
            loader.style.animationTimingFunction = timing + "," + "linear";
        }
        loader.classList.add("window__loader_active");
        let endedAnimations = 0;
        loader.onanimationend = () => {
            if (++endedAnimations === 2) {
                onAnimationEnd();
            }
        }
    }

    set currentPage(page) {
        this.currentPage = page;
    }

    setRows(rows) {
        if (this.ran) {
            if (this.currentPage !== this.Pages.MAIN) return;
            this.currentHandler.setRows(rows);
        } else {
            this.rows = rows;
        }
    }

    run() {
        this.ran = true;
        if (this.getCookie("remember-me") === null) {
            this.currentPage = this.Pages.AUTH;
        } else {
            this.currentPage = this.Pages.MAIN;
        }
        this.startLoadAnimation("1.5s", "default", () => {
            this.loadFromHtml(this.currentPage.template, () => {
                this.currentHandler = new this.currentPage.handler();
                this.currentHandler.rows = rows;
                this.currentHandler.handle();
            });
        })
    }

    refresh() {
        this.startLoadAnimation("1s", "default", () => {
            this.loadFromHtml(this.currentPage.template, () => {
                this.currentHandler = new this.currentPage.handler();
                this.currentHandler.rows = rows;
                this.currentHandler.handle();
            });
        })
    }

    querySelector(query) {
        return document.querySelector(query);
    }

}