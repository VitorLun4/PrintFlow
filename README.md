# Layerly (antes PrintFlow)

> O projeto se chamava **PrintFlow** nos documentos entregues até agora. O nome passou a ser **Layerly** em 17/11/2026.

> Gestão simples para quem vende peças de impressão 3D: estoque de filamento, custo de cada pedido e preço de venda sugerido.

![Status](https://img.shields.io/badge/status-em%20planejamento-yellow)
![Fase](https://img.shields.io/badge/PI-2%C2%BA%20per%C3%ADodo%20%C2%B7%20Fase%2003-blue)

---

## 📌 Sobre o projeto

Quem vende chaveiros, bonecos e outras peças impressas em 3D trabalhando por conta própria costuma anotar tudo no caderno, perde a noção de quanto filamento sobrou e não tem certeza se o preço cobrado cobriu o custo.

O **Layerly** é um site que resolve isso. O dono do negócio:

1. **cadastra o que tem**: filamentos (cada rolo comprado, com o seu preço), embalagens e impressoras;
2. **registra cada pedido**;
3. **recebe do sistema** o custo calculado, um preço sugerido (que ele pode alterar), o estoque atualizado e o lucro.

**Exemplo:** um pedido de boneco usa 54g de filamento preto e 7g de branco. O sistema soma filamento, embalagem e energia, e mostra o custo e o preço sugerido. Ninguém precisa fazer conta.

### Diferencial

Sistemas como SimplyPrint e 3DprinterOS controlam **frotas de impressoras** em ambientes de produção. O Layerly foca na **gestão do pequeno negócio**: estoque por cor e por lote, custo, embalagem e preço.

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
- Preço sugerido por canal de venda (Mercado Livre, Shopee, TikTok Shop), com taxas e impostos
- Margem de lucro escolhida pelo usuário, sobre o custo ou sobre o preço
- Pedidos em quadro, calendário e lista, com prazo e atraso automático
- Registro de falhas (o material perdido entra no custo e sai do estoque)
- Financeiro: receita, gastos, lucro, a receber e ponto de equilíbrio

----

## 🚦 Status atual

O projeto está na **Fase 02** do Projeto Integrador (2º período), dedicada a pesquisa, diagramas e organização. Ainda não há código de aplicação.

| Etapa | Situação |
|---|---|
| Protótipo (telas) | ✅ Disponível no Figma (38 telas) |
| Protótipo navegável (HTML) | ✅ Pasta `prototipo/` (abra o `index.html`) |
| Pesquisa com usuários | ✅ Concluída e disponivel|
| Diagramas (caso de uso e fluxo do pedido) |  ✅ Concluída e disponivel |
| Organização do projeto (quadro de tarefas) | ✅ Criada na aba Projects |
| Desenvolvimento do sistema | ⏳ Ainda não iniciado |

---

## 🔗 Links

- 🎨 [Protótipo no Figma (Layerly)](https://www.figma.com/design/0C3vRsebXvVaKMLgSCDLIQ)
- 🎨 [Protótipo anterior (PrintFlow)](https://www.figma.com/make/q6SKmiincn4dU1GHvKCSKy/PrintFlow-WireframePrototype)
- 📋 [Formulário de pesquisa](https://forms.gle/FxAyRrbNz3kQPpKu9)
- 🗂️ Quadro de tarefas: aba **Projects** deste repositório

---

## 🛠️ Tecnologias

Previstas: **Python com Django** no back-end, **HTML, CSS e JavaScript** no front-end. Banco: SQLite em desenvolvimento e PostgreSQL em produção.

---

## 📁 Estrutura do repositório

```
Layerly/
├── README.md        # esta página
├── CONTRIBUTING.md  # como trabalhar em grupo (branches, commits, PRs)
├── docs/            # documento do projeto, requisitos e material de design
├── prototipo/       # protótipo navegável em HTML/CSS/JS
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
