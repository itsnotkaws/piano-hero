const piano = document.getElementsByClassName("piano");

window.onload = () => {
    for (let i = 1; i <= 24; i++) {
        const div = document.createElement("div");
        div.classList.add(i <= 10 ? "black" : "white");
        piano[0].appendChild(div);
    }
}