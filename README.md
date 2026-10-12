# PrintFlow

> Gestão simples para quem vende peças de impressão 3D: estoque de filamento, custo de cada pedido e preço de venda sugerido.

![Status](https://img.shields.io/badge/status-em%20planejamento-yellow)
![Fase](https://img.shields.io/badge/PI-2%C2%BA%20per%C3%ADodo%20%C2%B7%20Fase%2002-blue)

---

## 📌 Sobre o projeto

Quem vende chaveiros, bonecos e outras peças impressas em 3D trabalhando por conta própria costuma anotar tudo no caderno, perde a noção de quanto filamento sobrou e não tem certeza se o preço cobrado cobriu o custo.

O **PrintFlow** é um site que resolve isso. O dono do negócio:

1. **cadastra o que tem**: filamentos (cada rolo comprado, com o seu preço), embalagens e impressoras;
2. **registra cada pedido**;
3. **recebe do sistema** o custo calculado, um preço sugerido (que ele pode alterar), o estoque atualizado e o lucro.

**Exemplo:** um pedido de boneco usa 54g de filamento preto e 7g de branco. O sistema soma filamento, embalagem e energia, e mostra o custo e o preço sugerido. Ninguém precisa fazer conta.

### Diferencial

Sistemas como SimplyPrint e 3DprinterOS controlam **frotas de impressoras** em ambientes de produção. O PrintFlow foca na **gestão do pequeno negócio**: estoque por cor e por lote, custo, embalagem e preço.

---

## ✨ Funcionalidades planejadas

- Cadastro e login do dono do negócio
- Cadastro de impressoras (com modelos prontos)
- Cadastro de filamentos por lote
- Cadastro de embalagens
- Criação de pedidos (produto, impressora, cores e gramas, embalagem e tempos)
- Custo estimado e preço sugerido
- Ajuste do preço final e cálculo da margem de lucro
- Registro de pagamento (total ou parcial)
- Atualização do status do pedido
- Registro do gasto real
- Consulta de estoque de filamentos
- Dashboard (lucro, desperdício e pedidos atrasados)

---

## 🚦 Status atual

O projeto está na **Fase 02** do Projeto Integrador (2º período), dedicada a pesquisa, diagramas e organização. Ainda não há código de aplicação.

| Etapa | Situação |
|---|---|
| Protótipo (wireframe) | ✅ Disponível no Figma |
| Pesquisa com usuários | ✅ Concluída e disponivel|
| Diagramas (caso de uso e fluxo do pedido) |  ✅ Concluída e disponivel |
| Organização do projeto (quadro de tarefas) | ✅ Criada na aba Projects |
| Desenvolvimento do sistema | ⏳ Ainda não iniciado |

---

## 🔗 Links

- 🎨 [Protótipo no Figma](https://www.figma.com/make/q6SKmiincn4dU1GHvKCSKy/PrintFlow-WireframePrototype)
- 📋 [Formulário de pesquisa](https://forms.gle/FxAyRrbNz3kQPpKu9)
- 🗂️ Quadro de tarefas: aba **Projects** deste repositório

---

## 🛠️ Tecnologias

A tecnologia final **ainda não foi decidida**. A ideia atual do grupo é usar **Python** no backend (com Django como possibilidade) e HTML/CSS no front-end.

---

## 📁 Estrutura do repositório

```
PrintFlow/
├── README.md        # esta página
├── docs/            # documento do projeto e material de apoio
├── diagramas/       # caso de uso e fluxo do pedido
├── pesquisa/        # formulário e resultados da pesquisa com usuários
└── src/             # código-fonte (entra quando começarmos a programar)
```

---

## 👥 Equipe

| Nome | Papel no projeto |
|---|---|
| Luis Fernando Duarte | Back - end |
| Vitor Gabriel Fontenele Luna | Back - end|
| Murilo de Freitas Pires | Front - end |
| Guilherme Rodrigues Lima | Front - end |

---

## 🎓 Contexto acadêmico

Projeto Integrador do curso de Engenharia de Software do **Centro Universitário UniEVANGÉLICA** (Anápolis, GO), 2º período.

---

## 📄 Licença

Projeto acadêmico, sem licença definida no momento.