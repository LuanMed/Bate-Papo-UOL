let mensagens = []; //pegar as mensagens salvas no servidor
let nome = "";
let novoNome = {};

entrarNaSala();
function entrarNaSala(){
    nome = prompt("Qual seu nome?");
    novoNome = {name: nome};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", novoNome);
    promessa.then(pegarMensagens);
    promessa.catch(nomeDeuErro);
}

function nomeDeuErro(erro){
    if(erro.response.status === 400){
        alert("Esse nome já está em uso. Por favor, tente novamente.");
        entrarNaSala();
    }
}

setInterval(manterConexao, 5000);
function manterConexao(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", novoNome);
}

setInterval(pegarMensagens, 3000);

function pegarMensagens(){
    // enviar a cartinha pedindo para pegar as mensagens salvas
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    //receber a resposta do servidor
    promessa.then(respostaChegou); // agendando para a função respostaChegou ser executa quando a resposta do servidor chegar 
}

function respostaChegou(resposta){
    mensagens = resposta.data;

    // mostrar mensagens no bate-papo
    mostrarMensagens();
}

function mandarMensagem(){
    const mensagemDigitada = document.querySelector('.campo-texto').value;
    const novaMensagem = {
        from: nome,
        to: "Todos",
        text: mensagemDigitada,
        type: "message",
    };
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    promise.then(pegarMensagens);
    promise.catch(deuErrado);
    
    document.querySelector('.campo-texto').value="";
}

function deuErrado() {
    alert(`Ocorreu um erro, aparentemente você não está mais na sala.\nVamos atualizar para que possa entrar novamente.`)
    window.location.reload()
}

function mostrarMensagens(){
    const listaMensagens = document.querySelector(".mensagens");
    listaMensagens.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++){
        if(mensagens[i].type == "status"){
            listaMensagens.innerHTML += `
            <li class="mensagem status">
                <span class="hora">(${mensagens[i].time})</span><span class="bold"> ${mensagens[i].from}</span> ${mensagens[i].text}
            </li>
            `
        } else if (mensagens[i].type == "message"){
            listaMensagens.innerHTML += `
            <li class="mensagem publica">
                <span class="hora">(${mensagens[i].time})</span><span class="bold"> ${mensagens[i].from}</span>
                 para <span class="bold">${mensagens[i].to}</span>: ${mensagens[i].text}
            </li>
            `
        } else if (mensagens[i].type == "private_message" && mensagens[i].to == nome){
            listaMensagens.innerHTML += `
            <li class="mensagem reservada">
                <span class="hora">(${mensagens[i].time})</span><span class="bold"> ${mensagens[i].from}</span>
                 para <span class="bold">${mensagens[i].to}</span>: ${mensagens[i].text}
            </li>
            `
        }
    }
    const ultimaMensagem = document.querySelectorAll('.mensagens li');
    ultimaMensagem[99].scrollIntoView();
    console.log(ultimaMensagem[99]);
}

// ------------------------------------------ implementação dos bônus -----------------------------------------------

document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        const simularClique = document.querySelector("#submit");
        simularClique.click();
    }
  });

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