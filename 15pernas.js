document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {  // Botão esquerdo do mouse
        Input.mouse.left = true;
    }
    if (event.button === 1) {  // Botão do meio do mouse
        Input.mouse.middle = true;
    }
    if (event.button === 2) {  // Botão direito do mouse
        Input.mouse.right = true;
        event.preventDefault();  // Impede a exibição do menu de contexto
    }
});
