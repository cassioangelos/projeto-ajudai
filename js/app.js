// =========================================
// CONFIGURAÇÃO SUPABASE
// =========================================

const SUPABASE_URL =
    "https://ivbkqtfvbxhrnhuzhift.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_oKa4BMU205_Ujq2HhxQ0dg_ApQB3t0Q";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =========================================
// NAVEGAÇÃO
// =========================================

function abrirCadastro() {

    window.location.href = "pages/cadastro.html";

}


function abrirLogin() {

    window.location.href = "pages/login.html";

}


// =========================================
// FORMULÁRIO DE CADASTRO
// =========================================

const cadastroForm =
    document.getElementById("cadastroForm");


if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const nome =
                document.getElementById("nome").value.trim();

            const nascimento =
                document.getElementById("nascimento").value;

            const cpf =
                document.getElementById("cpf").value.trim();

            const telefone =
                document.getElementById("telefone").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const senha =
                document.getElementById("senha").value;

            const confirmarSenha =
                document.getElementById("confirmarSenha").value;


            // =====================================
            // VALIDAR SENHAS
            // =====================================

            if (senha !== confirmarSenha) {

                alert("As senhas não são iguais.");

                return;

            }


            // =====================================
            // CRIAR USUÁRIO NO SUPABASE
            // =====================================

            try {

                const { data, error } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: senha,

                        options: {

                            data: {

                                nome: nome,

                                nascimento: nascimento,

                                cpf: cpf,

                                telefone: telefone

                            }

                        }

                    });


                if (error) {

                    console.error(
                        "Erro ao criar usuário:",
                        error
                    );

                    alert(
                        "Não foi possível criar a conta.\n\n" +
                        error.message
                    );

                    return;

                }


                console.log(
                    "Usuário criado:",
                    data.user
                );


                alert(
                    "Conta criada com sucesso!"
                );


                // =================================
                // IR PARA IDENTIDADE MÉDICA
                // =================================

                window.location.href =
                    "identidade.html";


            } catch (erro) {

                console.error(erro);

                alert(
                    "Ocorreu um erro ao criar sua conta."
                );

            }

        }
    );

}
// =========================================
// IDENTIDADE MÉDICA
// =========================================

async function salvarIdentidade() {

    // =====================================
    // VERIFICAR USUÁRIO AUTENTICADO
    // =====================================

    const {
        data: { user },
        error: erroUsuario
    } = await supabaseClient.auth.getUser();


    if (erroUsuario || !user) {

        alert(
            "Sua sessão não foi encontrada. Faça login novamente."
        );

        window.location.href = "login.html";

        return;
    }


    // =====================================
    // PEGAR DADOS DO FORMULÁRIO
    // =====================================

    const identidade = {

        usuario_id: user.id,

        nome:
            document.getElementById("nome").value.trim(),

        nascimento:
            document.getElementById("nascimento").value,

        sangue:
            document.getElementById("sangue").value,

        alergias:
            document.getElementById("alergias").value.trim(),

        condicoes:
            document.getElementById("condicoes").value.trim(),

        medicamentos:
            document.getElementById("medicamentos").value.trim(),

        cirurgias:
            document.getElementById("cirurgias").value.trim(),

        contato:
            document.getElementById("contato").value.trim(),

        parentesco:
            document.getElementById("parentesco").value.trim(),

        telefone_emergencia:
            document.getElementById("telefoneEmergencia").value.trim(),

        observacoes:
            document.getElementById("observacoes").value.trim()

    };


    // =====================================
    // SALVAR NO SUPABASE
    // =====================================

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("identidades")
            .insert([identidade])
            .select()
            .single();


        if (error) {

            console.error(
                "Erro ao salvar identidade:",
                error
            );

            alert(
                "Não foi possível salvar sua identidade médica.\n\n" +
                error.message
            );

            return;
        }


        console.log(
            "Identidade médica salva:",
            data
        );


        // =================================
        // GUARDAR TEMPORARIAMENTE PARA A
        // PÁGINA DE REVISÃO
        // =================================

        localStorage.setItem(
            "ajudai_identidade",
            JSON.stringify(data)
        );


        // =================================
        // IR PARA REVISÃO
        // =================================

        window.location.href =
            "revisao.html";


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        alert(
            "Ocorreu um erro ao salvar sua identidade médica."
        );

    }

}