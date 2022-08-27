let username = "";
let nome;
function verificaNome() {
    let aguarde = document.querySelector(".carregando");
    aguarde.classList.remove("escondido");
    username = document.querySelector(".username").value;
    nome = {name: `${username}`};
const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
requisicao.then(function(){setTimeout(iniciaAplicacao, 500)});
requisicao.catch(processaErro);
}
function processaErro(erro){
    if(erro.response.status !== 200){
        alert("O nome já existe! Escolha outro.");
        let div = document.querySelector(".carregando");
        div.classList.add("escondido");
    }  
        

}
function iniciaAplicacao() {
    let text = document.querySelector(".entrando-texto");
    text.innerHTML = "Entrando...";
    let div = document.querySelector(".login");
    div.classList.add("escondido");
    const breakbusca = setInterval(buscarMensagens, 3000);
    const buscaParticipants = setInterval(buscarParticipantes, 3000);
    const breakstatus = setInterval(verificaStatus, 5000);

}


function verificaStatus() {
    nome = {name: `${username}`};
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",nome);
    requisicao.then(function (){console.log("Tô online")});
    requisicao.catch(function (){console.log("Deu erro")});
}
// const breakbusca = setInterval(buscarMensagens, 3000);
// const buscaParticipants = setInterval(buscarParticipantes, 3000);
// buscarMensagensEparticipantes();
function buscarMensagens(){
    let requisicao = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    requisicao.then(renderizarMensagens);
    requisicao.catch(function (){console.log("Erro ao carregar mensagens")});
}

function renderizarMensagens(resposta){
    let aguarde = document.querySelector(".carregando");
    aguarde.classList.add("escondido");
    let mensagens = document.querySelector(".content");
    mensagens.innerHTML = "";
    // console.log(resposta);
    for(let i = 0; i< resposta.data.length; i++){
        if(resposta.data[i].type === "message") {
        mensagens.innerHTML = mensagens.innerHTML + `<div class="div-msg publica">
        <div class="hora"><p>${resposta.data[i].time}</p></div>
        <div class="descricao"><p><span class="user">${resposta.data[i].from}</span> para <span class="user">${resposta.data[i].to}</span>: <span class="msg">${resposta.data[i].text}</span></p></div>`
        }else if(resposta.data[i].type === "status") {
            mensagens.innerHTML = mensagens.innerHTML + `<div class="div-msg status">
            <div class="hora"><p>${resposta.data[i].time}</p></div>
            <div class="descricao"><p><span class="user">${resposta.data[i].from}</span> <span class="msg">${resposta.data[i].text}</span></p></div>` 
        }
    }
    const ultimaMensagem = document.querySelector('.content').lastElementChild;
    ultimaMensagem.scrollIntoView();
}

function buscarParticipantes(){
    let participantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    participantes.then(renderizarParticipantes);
    participantes.catch(function (){console.log("Deu erro")});
}

function renderizarParticipantes(resposta){
    // console.log("Lista recebida");
}


function enviarMensagem(){
    let texto = document.querySelector(".caixa-texto");
    if(username === null){
        username = "Anônimo";
    }
    if(texto.value !== ""){
    let mensagem = {from:`${username}`, to:"Todos", text:`${texto.value}`,type:"message"}
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem);
    requisicao.then(buscarMensagens);
    requisicao.catch(Recarregar);
}
    texto.value = "";
}

function Recarregar() {
    window.location.reload();
}

function mostraSidebar() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("escondido");
    console.log(sidebar.classList);
}