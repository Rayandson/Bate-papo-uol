let username = "";
let nome;
function verificaNome() {
  username = document.querySelector(".username").value;
  // if(username !== "") {
  let aguarde = document.querySelector(".carregando");
  aguarde.classList.remove("escondido");
  nome = { name: `${username}` };
  const requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome
  );
  requisicao.then(function () {
    setTimeout(iniciaAplicacao, 500);
  });
  requisicao.catch(processaErro);
}
// }
function processaErro(erro) {
  if (erro.response.status !== 200) {
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
  buscarMensagens();
  buscarParticipantes();
  const breakbusca = setInterval(buscarMensagens, 3000);
  const buscaParticipants = setInterval(buscarParticipantes, 10000);
  const breakstatus = setInterval(verificaStatus, 5000);
  setTimeout(firstCheck, 3000);
}

function verificaStatus() {
  nome = { name: `${username}` };
  let requisicao = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    nome
  );
  requisicao.then(function () {
    console.log("Tô online");
  });
  requisicao.catch(function () {
    console.log("Deu erro");
  });
}
// const breakbusca = setInterval(buscarMensagens, 3000);
// const buscaParticipants = setInterval(buscarParticipantes, 3000);
// buscarMensagensEparticipantes();
function buscarMensagens() {
  let requisicao = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  requisicao.then(renderizarMensagens);
  requisicao.catch(function () {
    console.log("Erro ao carregar mensagens");
  });
}

function renderizarMensagens(resposta) {
  let aguarde = document.querySelector(".carregando");
  aguarde.classList.add("escondido");
  let mensagens = document.querySelector(".content");
  mensagens.innerHTML = "";
  // console.log(resposta);
  for (let i = 0; i < resposta.data.length; i++) {
    if (resposta.data[i].type === "message") {
      mensagens.innerHTML =
        mensagens.innerHTML +
        `<div class="div-msg publica">
        <div class="hora"><p>${resposta.data[i].time}</p></div>
        <div class="descricao"><p><span class="user">${resposta.data[i].from}</span> para <span class="user">${resposta.data[i].to}</span>: <span class="msg">${resposta.data[i].text}</span></p></div>`;
    } else if (resposta.data[i].type === "status") {
      mensagens.innerHTML =
        mensagens.innerHTML +
        `<div class="div-msg status">
            <div class="hora"><p>${resposta.data[i].time}</p></div>
            <div class="descricao"><p><span class="user">${resposta.data[i].from}</span> <span class="msg">${resposta.data[i].text}</span></p></div>`;
    } else if (resposta.data[i].type === "private_message") {
      mensagens.innerHTML =
        mensagens.innerHTML +
        `<div class="div-msg reservada">
        <div class="hora"><p>${resposta.data[i].time}</p></div>
        <div class="descricao"><p><span class="user">${resposta.data[i].from}</span> para <span class="user">${resposta.data[i].to} (Reservadamente)</span>: <span class="msg">${resposta.data[i].text}</span></p></div>`;
    }
  }
  const ultimaMensagem = document.querySelector(".content").lastElementChild;
  ultimaMensagem.scrollIntoView();
}

function buscarParticipantes() {
  let participantes = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  participantes.then(renderizarParticipantes);
  participantes.catch(function () {
    console.log("Deu erro");
  });
}
let comparador;
function renderizarParticipantes(resposta) {
  let participantsDiv = document.querySelector(".ul-1");
  // ${resposta.data.length} numero de participantes
  if(ultimoSelecionado.innerHTML == `<img src="./images/people 2.png" alt=""><p>Todos</p><img class="check-icon selecionado" src="./images/check.png">`){
    participantsDiv.innerHTML = `<li><div class="li-div all" onclick="selecionarDestino(this)"><img src="./images/people 2.png" alt=""><p>Todos</p><img class="check-icon selecionado" src="./images/check.png"></div><div class="numParticipantes">(${resposta.data.length})</div></li>`; 
  }else {
  participantsDiv.innerHTML = `<li><div class="li-div all" onclick="selecionarDestino(this)"><img src="./images/people 2.png" alt=""><p>Todos</p><img class="check-icon" src="./images/check.png"></div><div class="numParticipantes">(${resposta.data.length})</div></li>`;
  }
  for (let i = 0; i < resposta.data.length; i++) {
    comparador = `<img src="./images/person-circle 2.png" alt=""><p>${resposta.data[i].name}</p><img class="check-icon selecionado" src="./images/check.png">`;
    
    if (comparador == ultimoSelecionado.innerHTML) {
      participantsDiv.innerHTML += `<li><div class="li-div" onclick="selecionarDestino(this)"><img src="./images/person-circle 2.png" alt=""><p>${resposta.data[i].name}</p><img class="check-icon selecionado" src="./images/check.png"></div></li>`;
      destino = `${resposta.data[i].name}`;
    } else {
      participantsDiv.innerHTML += `<li><div class="li-div" onclick="selecionarDestino(this)"><img src="./images/person-circle 2.png" alt=""><p>${resposta.data[i].name}</p><img class="check-icon" src="./images/check.png"></div></li>`;
    }
  }
}

function firstCheck(){
    let todos = document.querySelector(".all .check-icon");
    let primeiro = document.querySelector(".all")
    todos.classList.add("selecionado");
    ultimoSelecionado = primeiro;
}

let destino = "Todos";
function selecionarDestino(div) {
  let divCheck = div.querySelector(".check-icon");
  let selecionado = document.querySelector(".ul-1 .selecionado");
  if (selecionado !== null && selecionado !== divCheck) {
    selecionado.classList.remove("selecionado");
  }
  divCheck.classList.add("selecionado");
  ultimoSelecionado = div;
  let nome = div.querySelector("p");
  let rodape = document.querySelector(".rodape");
  destino = nome.innerHTML;
  rodape.innerHTML = `Enviando para ${destino} (${visibility})`;
}

let ultimoSelecionado = "";

function escolherVisibilidade(div) {
  let divCheck = div.querySelector(".check-icon");
  let divPai = div.querySelector(".check-icon").parentNode;
  let selecionado = document.querySelector(".ul-2 .selecionado");
  let visib = div.querySelector("p");
  visibility = visib.innerHTML;
  if (selecionado !== null && selecionado !== divCheck) {
    selecionado.classList.remove("selecionado");
  }
  let rodape = document.querySelector(".rodape");
  divCheck.classList.add("selecionado");
  if (divPai.classList.contains("all")) {
    rodape.innerHTML = `Enviando para Todos (${visibility})`;
  } else {
    rodape.innerHTML = `Enviando para ${destino} (${visibility})`;
  }
}
let visibility = "Pública";
let mensagem = "";

function enviarMensagem() {
  let texto = document.querySelector("#caixa-texto");
  if (texto.value !== "") {
    if (visibility === "Pública") {
      mensagem = {
        from: `${username}`,
        to: `${destino}`,
        text: `${texto.value}`,
        type: "message",
      };
    } else if (visibility === "Reservadamente") {
      mensagem = {
        from: `${username}`,
        to: `${destino}`,
        text: `${texto.value}`,
        type: "private_message",
      };
    }
    const requisicao = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      mensagem
    );
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

const newDiv = document.querySelector(".sidebar");
document.addEventListener("click", (e) => {
  if (e.target.id !== "peopleIcon" && !e.target.closest("[data-menu]")) {
    newDiv.style.display = "none";
  }
});

const inputElement = document.querySelector("#caixa-texto");
inputElement.addEventListener("keyup", function (e) {
  let key = e.which || e.keyCode;
  if (key == 13) {
    enviarMensagem();
  }
});
