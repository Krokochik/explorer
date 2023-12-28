class MainHandler {
    sort = {
        name: "nameColumn",
        type: "ASC"
    };

    columnGroups;
    rows = [];

    initColumnResizing() {
        function disableCursorActions() {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                element.style.pointerEvents = "none";
                element.style.userSelect = "none";
                element.style.cursor = "w-resize";
            });
        }

        function enableCursorActions() {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                element.style.pointerEvents = "all";
                element.style.userSelect = "none";
                element.style.cursor = "";
            });
        }

        const minWidth = 0;
        let maxWidth = Number.MAX_VALUE;

        for (let i = 0; i < this.columnGroups.length; i++) {
            const group = this.columnGroups[i];
            const column = group[0];
            const indent = group[1];

            let isResizing = false;
            let startX;
            let startWidth;

            indent.addEventListener("mousedown", event => {
                isResizing = true;
                startX = event.pageX;
                startWidth = column.offsetWidth;
                disableCursorActions();
            });

            document.addEventListener("mousemove", event => {
                if (!isResizing) return;
                const width = startWidth + (event.pageX - startX);

                const newWidth = Math.min(Math.max(width, minWidth), maxWidth);
                column.style.width = newWidth + 'px';
            });

            document.addEventListener("mouseup", event => {
                isResizing = false;
                enableCursorActions();
            });
        }

    }

    handleColumnClick(column) {
        column.onclick = () => {
            const previousColumn = document.querySelector(`#${this.sort.name}`);
            if (this.sort.name === column.id) {
                this.sort.type = this.sort.type === "ASC" ? "DESC" : "ASC";
            } else {
                this.sort.name = column.id;
                this.sort.type = "ASC";
            }

            if (previousColumn !== document.querySelector(`#${this.sort.name}`)) {
                previousColumn.querySelector("img").classList
                    .remove("table-head__img_visible");
                column.querySelector("img").classList
                    .add("table-head__img_visible");
            }
            column.querySelector("img")
                .style.transform = this.sort.type === "DESC" ? "rotate(180deg)" : "";
            this.sortRows();
            this.renderRows();
        }
    }

    set rows(rows) {
        this.rows = rows;
        this.sortRows();
        this.renderRows();
    }

    sortRows() {
        switch (this.sort.name) {
            case "nameColumn":
                this.rows.sort((row1, row2) => {
                    const name1 = row1.name.toLowerCase();
                    const name2 = row2.name.toLowerCase();

                    // By using -name1.localeCompare(name2), it would be reversing the sign
                    // of the comparison result, which can cause unexpected sorting behavior.
                    // Instead, handle the sorting logic by swapping the order of comparison.
                    if (this.sort.type === "ASC") {
                        return name1.localeCompare(name2);
                    } else {
                        return name2.localeCompare(name1);
                    }
                });
                break;
            case "dateColumn":
                this.rows.sort((row1, row2) => {
                    const date1 = row1.date;
                    const date2 = row2.date;
                    let res;

                    if (date1 === date2) return 0;
                    if (date1 > date2) {
                        res = -1;
                    } else if (date1 < date2) {
                        res = 1;
                    }

                    if (this.sort.type === "ASC") return res;
                    else return -res;
                });
                break;
            case "typeColumn":
                this.rows.sort((row1, row2) => {
                    const type1 = row1.type;
                    const type2 = row2.type;
                    let res;

                    if (type1.type === type2.type) return 0;
                    if (type1.type.name === type1.enum.FOLDER.name) res = -1;
                    else res = 1;

                    if (this.sort.type === "ASC") return res;
                    else return -res;
                });
                break;
            case "weightColumn":
                this.rows.sort((row1, row2) => {
                    const weight1 = row1.weight;
                    const weight2 = row2.weight;
                    let res = 0;

                    if (weight1 === weight2) return 0;
                    if (weight1 > weight2) res = -1;
                    else res = 1;

                    if (this.sort.type === "ASC") return res;
                    else return -res;
                });
        }
    }

    renderRows() {
        const tableBody = document.querySelector("#tableBody");
        tableBody.innerHTML = "";
        this.rows.forEach(row =>
            tableBody.innerHTML = tableBody.innerHTML.concat(row.getHtml())
        );
    }

    handle() {
        const nameColumn = document.querySelector("#nameColumn");
        const dateColumn = document.querySelector("#dateColumn");
        const typeColumn = document.querySelector("#typeColumn");
        const weightColumn = document.querySelector("#weightColumn");

        this.columnGroups = [
            [
                nameColumn,
                document.querySelector("#nameIndent")
            ],
            [
                dateColumn,
                document.querySelector("#dateIndent")
            ],
            [
                typeColumn,
                document.querySelector("#typeIndent")
            ],
            [
                weightColumn,
                document.querySelector("#weightIndent")
            ]
        ]
        this.initColumnResizing();

        for (let i = 0; i < this.columnGroups.length; i++) {
            const group = this.columnGroups[i];
            this.handleColumnClick(group[0]);
        }

        this.sortRows();
        this.renderRows();
    }
}

class Type {
    enum = Object.freeze({
        FOLDER: {name: "folder"}, FILE: {name: "file"}
    });
    name;
    type;
    image;

    constructor(name, type) {
        this.name = name;
        this.type = type;
        console.log(type);
        if (type.name === this.enum.FOLDER.name) {
            this.image = "images/folder.svg";
        } else {
            this.image = "images/file.svg";
        }
    }

    set type(type) {
        if (!(type instanceof this.enum)) return;
        if (type === this.enum.FOLDER) {
            this.image = "images/folder.svg";
        } else {
            this.image = "images/file.svg";
        }
        this.type = type;
    }
}

class Row {
    image;
    name;
    date;
    type;
    weight;

    constructor(image, name, date, type, weight) {
        if (!(type instanceof Type)) return;
        if (image === "default")
            image = type.image;
        this.image = image;
        this.name = name;
        this.date = date;
        this.type = type;
        this.weight = weight;
    }

    getPrettyDate() {
        const options = {
            year: "numeric", month: "long", day: "numeric",
            hour: "numeric", minute: "numeric"
        };
        return this.date.toLocaleString(navigator.language, options);
    }

    getPrettyWeight() {
        const k = 1000;
        const sizes = ["Б", "КБ", "МБ", "ГБ", "ТБ", "ПБ"];
        let weight = this.weight;
        let i = 0;

        while (weight >= k && i < sizes.length - 1) {
            weight /= k;
            i++;
        }

        return `${weight.toFixed(2)} ${sizes[i]}`;
    }

    getHtml() {
        return `
        <tr class="table-body__row">
            <td class="table-body__cell" colspan="1">
                <img class="table-body__img" src="${this.image}">
            </td>
            <td class="table-body__cell" colspan="2">
                ${this.name}
            </td>
            <td class="table-body__cell" colspan="2">
                ${this.getPrettyDate()}
            </td>
            <td class="table-body__cell" colspan="2">
                ${this.type.name}
            </td>
            <td class="table-body__cell" colspan="2">
                ${this.getPrettyWeight()}
            </td>
        </tr>`;
    }
}