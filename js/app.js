// =========================================
// CONEXÃO COM SUPABASE
// =========================================

const SUPABASE_URL =
    "https://ivbkqtfvbxhrnhuzhift.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oKa4BMU205_Ujq2HhxQ0dg_ApQB3t0Q";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

// ======================================================
// AjudAI
// Aplicação principal
// ======================================================


// ======================================================
// NAVEGAÇÃO
// ======================================================

function abrirCadastro() {

    window.location.href = "pages/cadastro.html";

}


function abrirLogin() {

    window.location.href = "pages/login.html";

}


// ======================================================
// CADASTRO
// ======================================================

const cadastroForm =
    document.getElementById("cadastroForm");


if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const senha =
                document.getElementById("senha").value;


            const confirmarSenha =
                document.getElementById("confirmarSenha").value;


            // ------------------------------------------
            // VALIDAR SENHAS
            // ------------------------------------------

            if (senha !== confirmarSenha) {

                alert(
                    "As senhas não são iguais."
                );

                return;

            }


            // ------------------------------------------
            // SALVAR DADOS DO USUÁRIO
            // ------------------------------------------

            const usuario = {

                nome:
                    document.getElementById("nome").value,

                nascimento:
                    document.getElementById("nascimento").value,

                cpf:
                    document.getElementById("cpf").value,

                telefone:
                    document.getElementById("telefone").value,

                email:
                    document.getElementById("email").value

            };


            localStorage.setItem(
                "ajudai_usuario",
                JSON.stringify(usuario)
            );


            // ------------------------------------------
            // CONTINUAR
            // ------------------------------------------

            alert(
                "✅ Cadastro realizado com sucesso!"
            );


            window.location.href =
                "identidade.html";

        }
    );

}


// ======================================================
// IDENTIDADE MÉDICA
// ======================================================

function salvarIdentidade() {


    // ------------------------------------------
    // COLETAR DADOS
    // ------------------------------------------

    const identidade = {

        nome:
            document.getElementById("nome").value,

        nascimento:
            document.getElementById("nascimento").value,

        sangue:
            document.getElementById("sangue").value,

        alergias:
            document.getElementById("alergias").value,

        condicoes:
            document.getElementById("condicoes").value,

        medicamentos:
            document.getElementById("medicamentos").value,

        cirurgias:
            document.getElementById("cirurgias").value,

        contato:
            document.getElementById("contato").value,

        parentesco:
            document.getElementById("parentesco").value,

        telefoneEmergencia:
            document.getElementById(
                "telefoneEmergencia"
            ).value,

        observacoes:
            document.getElementById("observacoes").value

    };


    // ------------------------------------------
    // SALVAR
    // ------------------------------------------

    localStorage.setItem(
        "ajudai_identidade",
        JSON.stringify(identidade)
    );


    // ------------------------------------------
    // CONTINUAR PARA REVISÃO
    // ------------------------------------------

    window.location.href =
        "revisao.html";

}


// ======================================================
// CONFIRMAÇÃO DA IDENTIDADE
// ======================================================

function confirmarIdentidade() {


    localStorage.setItem(
        "ajudai_identidade_confirmada",
        "true"
    );


    alert(
        "✅ Identidade médica confirmada!"
    );


    // ------------------------------------------
    // IR PARA O PERFIL
    // ------------------------------------------

    window.location.href =
        "perfil.html";

}


// ======================================================
// EDITAR IDENTIDADE
// ======================================================

function voltarParaEdicao() {

    window.location.href =
        "identidade.html";

}


function editarIdentidade() {

    window.location.href =
        "identidade.html";

}


// ======================================================
// VISUALIZAR IDENTIDADE PÚBLICA
// ======================================================

function visualizarIdentidade() {

    window.location.href =
        "publica.html";

}