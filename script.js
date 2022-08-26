let username = "";

username = prompt("Digite seu nome");
let nome = {name: `${username}`};
verificaNome();
function verificaNome() {
const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
requisicao.then(function (){console.log("Nome enviado")});
requisicao.catch(processaErro);
}
function processaErro(erro){
    if(erro.response.status !== 200){
        username = prompt("O nome já existe! Escolha outro.");
        verificaNome();
    }  

}

const breakstatus = setInterval(verificaStatus, 5000);
let i = 0;
function verificaStatus() {
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",nome);
    requisicao.then(function (){console.log("Tô online")});
    requisicao.catch(function (){console.log("Deu erro")});
    i++;
}
const breakbusca = setInterval(buscarMensagens, 3000);
const buscaParticipants = setInterval(buscarParticipantes, 3000);
// buscarMensagensEparticipantes();
function buscarMensagens(){
    let requisicao = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    requisicao.then(renderizarMensagens);
    requisicao.catch(function (){console.log("Erro ao carregar mensagens")});
}

function renderizarMensagens(resposta){
    let mensagens = document.querySelector(".content");
    mensagens.innerHTML = "";
    // console.log(resposta);
    for(let i = 0; i< resposta.data.length; i++){
        if(resposta.data[i].type === "message") {
        mensagens.innerHTML = mensagens.innerHTML + `<div class="div-msg publica">
        <div class="hora"><p>${resposta.data[i].time}</p></div>
        <div class="descricao"><p><span>${resposta.data[i].from}</span> para <span>${resposta.data[i].to}</span>:</p></div>
        <div class="msg">${resposta.data[i].text}</div>`
        }else if(resposta.data[i].type === "status") {
            mensagens.innerHTML = mensagens.innerHTML + `<div class="div-msg status">
            <div class="hora"><p>${resposta.data[i].time}</p></div>
            <div class="descricao"><p><span>${resposta.data[i].from}</span></p></div>
            <div class="msg">${resposta.data[i].text}</div>` 
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
