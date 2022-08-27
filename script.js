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
    let participantsDiv = document.querySelector(".ul-1");
    participantsDiv.innerHTML = `<li><div class="li-div"><img src="./images/people 2.png" alt=""><p>Todos (${resposta.data.length})</p><img class="check-icon selecionado" src="./images/check.png">`;
    for(let i = 0; i < resposta.data.length; i++) {
        participantsDiv.innerHTML +=  `</li><li><div class="li-div"><img src="./images/person-circle 2.png" alt=""><p>${resposta.data[i].name}</p><img class="check-icon" src="./images/check.png"></li>`
    }
}


function enviarMensagem(){
    let texto = document.querySelector("#caixa-texto");
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
    sidebar.style.display = "initial";
    console.log("Foi");
}

function esconderSidebar() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
    console.log("Escondeu");
}

const newDiv = document.querySelector(".sidebar")
document.addEventListener('click', (e) => {
    if(e.target.id !== 'peopleIcon' && !e.target.closest('[data-menu]')) {
      newDiv.style.display = "none";
    }
})

const inputElement = document.querySelector('#caixa-texto');
inputElement.addEventListener('keyup', function(e){
  let key = e.which || e.keyCode;
  if (key == 13) { 
    enviarMensagem();
  }
}); 