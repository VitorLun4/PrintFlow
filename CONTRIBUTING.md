# Como contribuir

## Branches
- `main`: sempre estável, é o que vai para a entrega. Ninguém commita direto nela.
- Uma branch por tarefa, saindo da `main`, com o padrão `tipo/descricao-curta`:
  `feat/calculo-de-preco`, `fix/estoque-negativo`, `docs/diagrama-de-classes`, `design/tela-financeiro`.

## Commits
Mensagem curta no imperativo, com prefixo:
`feat: adiciona cálculo de preço por canal` · `fix: corrige desconto do lote` · `docs: atualiza README` · `test: cobre margem sobre o preço` · `refactor: ...`

## Pull requests
1. Abra o PR da sua branch para a `main` e referencie a issue (`Fecha #12`).
2. Peça revisão de pelo menos 1 pessoa do grupo.
3. Só faça merge com o PR aprovado e o código rodando.

## Divisão de áreas
- Back-end e banco: Luis e Vitor
- Front-end: Murilo e Guilherme

## Regras rápidas
- Dê `git pull` na `main` antes de criar a branch.
- Nunca suba senhas, chaves ou o arquivo `.env`.
- Documentos oficiais entram em `docs/`, diagramas em `diagramas/`, pesquisa em `pesquisa/`.
