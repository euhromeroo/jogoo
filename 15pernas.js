document.addEventListener("mousedown", function(event) {
    if ((event.button = 0)) {
        Input.mouse.left = true;
    }
    if ((event.button = 1)) {
        Input.mouse.middle = true;
    }
    if ((event.button = 2)) {
        Input.mouse.rigth = true;
    }
});