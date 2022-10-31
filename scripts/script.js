let mensagens = []; //pegar as mensagens salvas no servidor
let contatos = [];
let nome = "";
let novoNome = {};
let messageType = "message";
let qualContato = "Todos";
let elementoLogin = {};
let elementoLoading = {};
let elementoMensagens = {};
let elementoTelaLogin = {};

function entrarNaSala(){
    nome = document.querySelector(".campo-nome").value;
    novoNome = {name: nome};
    pegarElementos();
    elementoLogin.classList.toggle("hidden");
    elementoLoading.classList.toggle("hidden");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", novoNome);
    document.querySelector(".campo-nome").value = "";
    promessa.then(loginDeuCerto);
    promessa.catch(nomeDeuErro);
}

function nomeDeuErro(erro){
    if(erro.response.status === 400){
        alert("Esse nome já está em uso. Por favor, tente novamente.");
        elementoLoading.classList.toggle("hidden");
        elementoLogin.classList.toggle("hidden");
    }
}

function pegarElementos(){
    elementoLogin = document.querySelector(".container-login");
    elementoLoading = document.querySelector(".container-loading");
    elementoMensagens = document.querySelector(".container");
    elementoTelaLogin = document.querySelector(".tela-login");
}

function loginDeuCerto(){
    elementoTelaLogin.classList.add("hidden");
    elementoMensagens.classList.remove("hidden");
    pegarMensagens();
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
        to: qualContato,
        text: mensagemDigitada,
        type: messageType,
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
        if (mensagens[i].from.length > 15){
            mensagens[i].from = mensagens[i].from.substring(0,15) + "...";
        }
        if (mensagens[i].to.length > 15){
            mensagens[i].to = mensagens[i].to.substring(0,15) + "...";
        }

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
        } else if (mensagens[i].type == "private_message" && (mensagens[i].to == nome || mensagens[i].from == nome)){
            listaMensagens.innerHTML += `
            <li class="mensagem reservada">
                <span class="hora">(${mensagens[i].time})</span><span class="bold"> ${mensagens[i].from}</span>
                 para <span class="bold">${mensagens[i].to}</span>: ${mensagens[i].text}
            </li>
            `
        }
    }
    const ultimaMensagem = document.querySelectorAll('.mensagens li');
    ultimaMensagem[ultimaMensagem.length-1].scrollIntoView();
}

// ------------------------------------------ implementação dos bônus -----------------------------------------------



// Enviar mensagem com ENTER -----------------------------------------------------------------
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        const simularClique = document.querySelector("#submit");
        simularClique.click();
    }
  });

// Tela de login -----------------------------------------------------------------------------



// Pegar contatos do servidor ----------------------------------------------------------------
pegarContatos();
setInterval(pegarContatos, 10000);
function pegarContatos() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promessa.then(mostrarContatos);
}

function mostrarContatos(resposta){
    contatos = resposta.data;

    const listaContatos = document.querySelector(".lista-contatos");
    listaContatos.innerHTML = `<li data-identifier="participant" class="lista contatos selecionado" onclick="pickContact(this)">
    <ion-icon name="people"></ion-icon>
    <p class="contato">Todos</p>
    <ion-icon class="verde" name="checkmark-sharp"></ion-icon>
</li>`;

    for (let i = 0; i < contatos.length; i++){
        if (contatos[i].name.length > 15){
            contatos[i].name = contatos[i].name.substring(0,15) + "...";
        }
        listaContatos.innerHTML += `<li data-identifier="participant" class="lista contatos" onclick="pickContact(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p class="contato">${contatos[i].name}</p>
        <ion-icon class="verde hidden" name="checkmark-sharp"></ion-icon>
    </li>`
    }
}

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
    const elementSelecionado = document.querySelector(".lista-contatos .selecionado .verde");
    elementSelecionado.classList.remove("hidden");

    const pessoaSel = document.querySelector(".lista-contatos .selecionado .contato");
    qualContato = pessoaSel.innerHTML;

    informacaoSecundaria()
}

function pickVisibility(selected){
    const selecionadoAntes = document.querySelector(".lista-visibilidade .selecionado");
    if (selecionadoAntes !== null){
        const elementSelecionado = document.querySelector(".lista-visibilidade .selecionado .verde");
        elementSelecionado.classList.add("hidden");
        selecionadoAntes.classList.remove("selecionado");
    }

    selected.classList.add("selecionado");
    const elementSelecionado = document.querySelector(".lista-visibilidade .selecionado .verde");
    elementSelecionado.classList.remove("hidden");

    
    const tipoSel = document.querySelector(".lista-visibilidade .selecionado .tipoMensagem");
    let tipoDaMensagem = tipoSel.innerHTML;
    if (tipoDaMensagem === "Público"){
        messageType = "message";
    } else {
        messageType = "private_message"
    }
    informacaoSecundaria();
}

function informacaoSecundaria() {
    const confirmando = document.querySelector(".tipo-mensagem");
    if (messageType == "private_message"){
        confirmando.innerHTML = `Enviando para ${qualContato} (Reservadamente)`;
    } else {
        confirmando.innerHTML = `Enviando para ${qualContato}`;
    }
}