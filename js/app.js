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


            // VALIDAR SENHAS

            if (senha !== confirmarSenha) {

                alert("As senhas não são iguais.");

                return;
            }


            // CRIAR USUÁRIO NO SUPABASE

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


                alert("Conta criada com sucesso!");


                window.location.href = "identidade.html";


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
// CARREGAR IDENTIDADE PARA EDIÇÃO
// =========================================

async function carregarIdentidadeParaEdicao() {

    // Verifica se estamos na página de identidade

    if (!document.getElementById("telefoneEmergencia")) {
        return;
    }


    try {

        // Verificar usuário autenticado

        const {
            data: { user },
            error: erroUsuario
        } = await supabaseClient.auth.getUser();


        if (erroUsuario || !user) {

            alert(
                "Sua sessão expirou. Faça login novamente."
            );

            window.location.href = "login.html";

            return;
        }


        // Buscar identidade existente

        const {
            data: identidade,
            error
        } = await supabaseClient
            .from("identidades")
            .select("*")
            .eq("usuario_id", user.id)
            .maybeSingle();


        if (error) {

            console.error(
                "Erro ao buscar identidade:",
                error
            );

            alert(
                "Não foi possível carregar seus dados médicos."
            );

            return;
        }


        // Se ainda não existe identidade, formulário fica vazio

        if (!identidade) {
            return;
        }


        // Preencher formulário com os dados existentes

        document.getElementById("nome").value =
            identidade.nome || "";

        document.getElementById("nascimento").value =
            identidade.nascimento || "";

        document.getElementById("sangue").value =
            identidade.sangue || "";

        document.getElementById("alergias").value =
            identidade.alergias || "";

        document.getElementById("condicoes").value =
            identidade.condicoes || "";

        document.getElementById("medicamentos").value =
            identidade.medicamentos || "";

        document.getElementById("cirurgias").value =
            identidade.cirurgias || "";

        document.getElementById("contato").value =
            identidade.contato || "";

        document.getElementById("parentesco").value =
            identidade.parentesco || "";

        document.getElementById("telefoneEmergencia").value =
            identidade.telefone_emergencia || "";

        document.getElementById("observacoes").value =
            identidade.observacoes || "";


        console.log(
            "Identidade carregada para edição:",
            identidade
        );


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar identidade:",
            erro
        );

        alert(
            "Ocorreu um erro ao carregar os dados médicos."
        );
    }

}


// =========================================
// SALVAR OU ATUALIZAR IDENTIDADE MÉDICA
// =========================================

async function salvarIdentidade() {

    try {

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
        // BUSCAR IDENTIDADE EXISTENTE
        // =====================================

        const {
            data: existente,
            error: erroBusca
        } = await supabaseClient
            .from("identidades")
            .select("id")
            .eq("usuario_id", user.id)
            .maybeSingle();


        if (erroBusca) {

            console.error(
                "Erro ao verificar identidade existente:",
                erroBusca
            );

            alert(
                "Não foi possível verificar sua identidade médica."
            );

            return;
        }


        // =====================================
        // ATUALIZAR OU INSERIR
        // =====================================

        let resultado;


        if (existente) {

            // Já existe: atualizar o registro

            resultado = await supabaseClient
                .from("identidades")
                .update(identidade)
                .eq("id", existente.id)
                .eq("usuario_id", user.id)
                .select()
                .single();

        } else {

            // Ainda não existe: criar novo registro

            resultado = await supabaseClient
                .from("identidades")
                .insert([identidade])
                .select()
                .single();

        }


        const { data, error } = resultado;


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


        // =====================================
        // GUARDAR CÓPIA LOCAL PARA REVISÃO
        // =====================================

        localStorage.setItem(
            "ajudai_identidade",
            JSON.stringify(data)
        );


        console.log(
            "Identidade salva com sucesso:",
            data
        );


        // =====================================
        // IR PARA REVISÃO
        // =====================================

        window.location.href = "revisao.html";


    } catch (erro) {

        console.error(
            "Erro inesperado ao salvar identidade:",
            erro
        );

        alert(
            "Ocorreu um erro ao salvar sua identidade médica."
        );
    }

}


// =========================================
// INICIAR CARREGAMENTO DO FORMULÁRIO
// =========================================

carregarIdentidadeParaEdicao();