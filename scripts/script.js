function mostrarMenu(){
    const menuLateral = document.querySelector(".sidebar")
    menuLateral.classList.remove("hidden");
}

function esconderMenu(){
    const menuLateral = document.querySelector(".sidebar")
    menuLateral.classList.add("hidden");
}

function pickContact(selected){
    const selecionadoAntes = document.querySelector(".lista-contatos .selecionado");
    if (selecionadoAntes !== null){
        const elementSelecionado = document.querySelector(".lista-contatos .selecionado .verde")
        elementSelecionado.classList.add("hidden");
        selecionadoAntes.classList.remove("selecionado");
    }

    selected.classList.add("selecionado");
    const elementSelecionado = document.querySelector(".lista-contatos .selecionado .verde")
    elementSelecionado.classList.remove("hidden");
}

function pickVisibility(selected){
    const selecionadoAntes = document.querySelector(".lista-visibilidade .selecionado");
    if (selecionadoAntes !== null){
        const elementSelecionado = document.querySelector(".lista-visibilidade .selecionado .verde")
        elementSelecionado.classList.add("hidden");
        selecionadoAntes.classList.remove("selecionado");
    }

    selected.classList.add("selecionado");
    const elementSelecionado = document.querySelector(".lista-visibilidade .selecionado .verde")
    elementSelecionado.classList.remove("hidden");
}