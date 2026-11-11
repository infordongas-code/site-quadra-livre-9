let agendamentos = JSON.parse(
    localStorage.getItem("agendamentosQuadra")
) || [];

let filtroAtual = "Todos";

const paginaAgendamento =
    document.getElementById("paginaAgendamento");

const paginaAdmin =
    document.getElementById("paginaAdmin");

const btnAgendar =
    document.getElementById("btnAgendar");

const btnAdmin =
    document.getElementById("btnAdmin");

const form =
    document.getElementById("formAgendamento");

const campoData =
    document.getElementById("data");


/* DATA MÍNIMA */

const hoje = new Date();

const ano = hoje.getFullYear();

const mes = String(hoje.getMonth() + 1).padStart(2, "0");

const dia = String(hoje.getDate()).padStart(2, "0");

campoData.min = `${ano}-${mes}-${dia}`;


/* IR PARA AGENDAMENTO */

btnAgendar.addEventListener("click", function () {

    paginaAgendamento.classList.remove("oculto");

    paginaAdmin.classList.add("oculto");

    btnAgendar.classList.add("ativo");

    btnAdmin.classList.remove("ativo");

});


/* ENTRAR NA ADMINISTRAÇÃO */

btnAdmin.addEventListener("click", function () {

    const senha = prompt("🔐 Digite a senha de administrador:");

    if (senha === "Dongas2026") {

        paginaAdmin.classList.remove("oculto");

        paginaAgendamento.classList.add("oculto");

        btnAdmin.classList.add("ativo");

        btnAgendar.classList.remove("ativo");

        renderizarAdmin();

    } else {

        alert("❌ Senha incorreta!");

    }

});


/* SALVAR DADOS */

function salvarDados() {

    localStorage.setItem(
        "agendamentosQuadra",
        JSON.stringify(agendamentos)
    );

}


/* FORMULÁRIO */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome =
        document.getElementById("nome").value.trim();

    const turma =
        document.getElementById("turma").value.trim();

    const telefone =
        document.getElementById("telefone").value.trim();

    const endereco =
        document.getElementById("endereco").value.trim();

    const data =
        document.getElementById("data").value;

    const horario =
        document.getElementById("horario").value;

    const modalidade =
        document.getElementById("modalidade").value;

    const participantes =
        document.getElementById("participantes").value;

    const observacao =
        document.getElementById("observacao").value.trim();


    const horarioOcupado = agendamentos.some(function (item) {

        return (
            item.data === data &&
            item.horario === horario &&
            item.status !== "Recusado"
        );

    });


    if (horarioOcupado) {

        alert(
            "Esse horário já possui uma solicitação. Escolha outro horário."
        );

        return;
    }


    const novoAgendamento = {

        id: Date.now(),

        nome: nome,

        turma: turma,

        telefone: telefone,

        endereco: endereco,

        data: data,

        horario: horario,

        modalidade: modalidade,

        participantes: participantes,

        observacao: observacao,

        status: "Pendente"

    };


    agendamentos.push(novoAgendamento);

    salvarDados();

    form.reset();

    alert("Agendamento enviado com sucesso!");

    renderizarAluno();

});


/* FORMATAR DATA */

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* LISTA DO ALUNO */

function renderizarAluno() {

    const lista =
        document.getElementById("listaAluno");

    const pesquisa =
        document.getElementById("pesquisaAluno")
            .value
            .toLowerCase();


    const dados =
        agendamentos.filter(function (item) {

            return (
                item.nome.toLowerCase().includes(pesquisa) ||
                item.modalidade.toLowerCase().includes(pesquisa) ||
                item.turma.toLowerCase().includes(pesquisa)
            );

        });


    if (dados.length === 0) {

        lista.innerHTML = `
            <div class="vazio">
                <div class="icone">📭</div>
                <p>Nenhum agendamento encontrado.</p>
            </div>
        `;

        return;
    }


    lista.innerHTML = dados.map(function (item) {

        return `
            <div class="agendamento">

                <h3>${item.nome}</h3>

                <div class="info">

                    <div>
                        📅 <strong>Data:</strong>
                        ${formatarData(item.data)}
                    </div>

                    <div>
                        🕐 <strong>Horário:</strong>
                        ${item.horario}
                    </div>

                    <div>
                        🏀 <strong>Modalidade:</strong>
                        ${item.modalidade}
                    </div>

                    <div>
                        👥 <strong>Participantes:</strong>
                        ${item.participantes}
                    </div>

                    <div>
                        🎓 <strong>Turma:</strong>
                        ${item.turma}
                    </div>

                    <div>
                        📞 <strong>Telefone:</strong>
                        ${item.telefone}
                    </div>

                </div>

                <span class="status ${item.status}">
                    ${item.status}
                </span>

            </div>
        `;

    }).join("");

}


/* PESQUISA DO ALUNO */

document
    .getElementById("pesquisaAluno")
    .addEventListener("input", renderizarAluno);


/* ADMIN */

function renderizarAdmin() {

    const lista =
        document.getElementById("listaAdmin");

    const pesquisa =
        document.getElementById("pesquisaAdmin")
            .value
            .toLowerCase();


    const dados =
        agendamentos.filter(function (item) {

            const correspondeFiltro =
                filtroAtual === "Todos" ||
                item.status === filtroAtual;

            const correspondePesquisa =
                item.nome.toLowerCase().includes(pesquisa) ||
                item.turma.toLowerCase().includes(pesquisa) ||
                item.modalidade.toLowerCase().includes(pesquisa);

            return correspondeFiltro && correspondePesquisa;

        });


    atualizarContadores();


    if (dados.length === 0) {

        lista.innerHTML = `
            <div class="vazio">
                <div class="icone">📭</div>
                <p>Nenhum agendamento encontrado.</p>
            </div>
        `;

        return;
    }


    lista.innerHTML = dados.map(function (item) {

        return `
            <div class="agendamento">

                <h3>${item.nome}</h3>

                <div class="info">

                    <div>
                        📅 <strong>Data:</strong>
                        ${formatarData(item.data)}
                    </div>

                    <div>
                        🕐 <strong>Horário:</strong>
                        ${item.horario}
                    </div>

                    <div>
                        🏀 <strong>Modalidade:</strong>
                        ${item.modalidade}
                    </div>

                    <div>
                        👥 <strong>Participantes:</strong>
                        ${item.participantes}
                    </div>

                    <div>
                        🎓 <strong>Turma:</strong>
                        ${item.turma}
                    </div>

                    <div>
                        📞 <strong>Telefone:</strong>
                        ${item.telefone}
                    </div>

                    <div>
                        🏠 <strong>Endereço:</strong>
                        ${item.endereco}
                    </div>

                </div>

                <span class="status ${item.status}">
                    ${item.status}
                </span>

                ${
                    item.observacao
                    ? `<p style="margin-top:12px;">
                        <strong>Observação:</strong>
                        ${item.observacao}
                    </p>`
                    : ""
                }

                <div class="acoes">

                    <button
                        class="btn-aprovar"
                        onclick="aprovar(${item.id})"
                    >
                        ✓ Aprovar
                    </button>

                    <button
                        class="btn-recusar"
                        onclick="recusar(${item.id})"
                    >
                        ✕ Recusar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirAgendamento(${item.id})"
                    >
                        🗑 Excluir
                    </button>

                </div>

            </div>
        `;

    }).join("");

}


/* CONTADORES */

function atualizarContadores() {

    document.getElementById("totalAdmin").textContent =
        agendamentos.length;

    document.getElementById("totalPendentes").textContent =
        agendamentos.filter(function (item) {

            return item.status === "Pendente";

        }).length;

    document.getElementById("totalAprovados").textContent =
        agendamentos.filter(function (item) {

            return item.status === "Aprovado";

        }).length;

    document.getElementById("totalRecusados").textContent =
        agendamentos.filter(function (item) {

            return item.status === "Recusado";

        }).length;

}


/* APROVAR */

function aprovar(id) {

    const item =
        agendamentos.find(function (agendamento) {

            return agendamento.id === id;

        });


    if (!item) {
        return;
    }


    item.status = "Aprovado";

    salvarDados();

    renderizarAdmin();

    renderizarAluno();

}


/* RECUSAR */

function recusar(id) {

    const item =
        agendamentos.find(function (agendamento) {

            return agendamento.id === id;

        });


    if (!item) {
        return;
    }


    item.status = "Recusado";

    salvarDados();

    renderizarAdmin();

    renderizarAluno();

}


/* EXCLUIR */

function excluirAgendamento(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este agendamento?"
        );


    if (!confirmar) {
        return;
    }


    agendamentos =
        agendamentos.filter(function (item) {

            return item.id !== id;

        });


    salvarDados();

    renderizarAdmin();

    renderizarAluno();

}


/* FILTROS */

document
    .querySelectorAll(".filtro")
    .forEach(function (botao) {

        botao.addEventListener("click", function () {

            document
                .querySelectorAll(".filtro")
                .forEach(function (b) {

                    b.classList.remove("ativo");

                });


            botao.classList.add("ativo");


            filtroAtual =
                botao.getAttribute("data-filtro");


            renderizarAdmin();

        });

    });


/* PESQUISA ADMIN */

document
    .getElementById("pesquisaAdmin")
    .addEventListener("input", renderizarAdmin);


/* INICIAR */

renderizarAluno();

atualizarContadores();