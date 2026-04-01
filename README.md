# md-exporter

CLI para gerar **PDF** e/ou **HTML** a partir de arquivos **Markdown** ([md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) + Chromium).

O comando instalado chama-se **`md-export`** (o nome do pacote npm local é `md-exporter`).

---

## Instalação global (recomendado)

**1.** Clone ou copie o repositório e, **uma vez**, instale as dependências na pasta do projeto:

```bash
cd /path/to/md-exporter
npm install
```

**2.** Instale o CLI no Node global apontando para essa pasta:

```bash
npm install -g /path/to/md-exporter
```

Troque `/path/to/md-exporter` pelo caminho **absoluto** do clone no seu disco (por exemplo `~/projetos/md-exporter`). Use caminho **absoluto** ou `~/...`.

**3.** Confira se o comando está no `PATH`:

```bash
md-export --help
```

Para **atualizar** depois de mudar código ou dependências:

```bash
cd /path/to/md-exporter && npm install
npm install -g /path/to/md-exporter
```

---

## Como usar

Depois da instalação global, rode **`md-export`** de **qualquer pasta**.

### Sintaxe

```text
md-export -i <arquivo.md> [-o <pasta-saída>] [-f pdf|html|both]
```

Ou forma **posicional** (útil para evitar conflito de flags com outros tools):

```text
md-export <arquivo.md> [pasta-saída] [pdf|html|both]
```

| Opção | Curto | Padrão | Descrição |
|-------|-------|--------|-----------|
| `--input` | `-i` | *(obrigatório)* | Arquivo `.md` de entrada |
| `--output` | `-o` | `./output`* | Pasta de saída (criada se não existir). Aceita `~/Downloads` |
| `--format` | `-f` | `both` | `pdf`, `html` ou `both` |
| `--help` | `-h` | — | Ajuda |

\*O padrão `./output` é relativo ao **diretório atual do terminal**, não à pasta do `md-exporter`.

Imagens e links **relativos** no Markdown são resolvidos a partir da **pasta do arquivo `.md`**.

### Exemplos (instalação global)

```bash
# PDF + HTML na pasta padrão ./output (relativa a onde você está no terminal)
md-export -i ~/Documentos/artigo.md

# PDF + HTML em Downloads
md-export -i ~/projetos/docs/manual.md -o ~/Downloads -f both

# Só PDF
md-export -i ~/Documentos/notas.md -o ~/Desktop -f pdf

# Posicional: arquivo → pasta → formato
md-export ~/Documentos/artigo.md ~/Downloads both
```

Sempre que possível use **caminhos absolutos** em `-i` e `-o` para o resultado não depender da pasta em que você abriu o terminal.

---

## Desenvolvimento (sem `npm install -g`)

Na pasta do projeto, após `npm install`:

```bash
node cli.js -i ~/Documentos/artigo.md -o ~/Downloads -f both
```

**Link simbólico global** (alterações no código refletem na hora):

```bash
cd /path/to/md-exporter
npm link
# depois: md-export ... em qualquer pasta
```

Remover o link: `npm unlink -g md-exporter`

### `npm run` neste repositório

O npm trata `-f` como `--force`. Ao usar `npm run export` com flags, use **`--`** antes dos argumentos:

```bash
npm run export -- -i ../docs/exemplo.md -o ~/Downloads -f both
```

Ou posicional:

```bash
npm run export -- ../docs/exemplo.md ~/Downloads both
```

Dentro da pasta do projeto:

```bash
npx md-export -i ../docs/exemplo.md -o ~/Downloads -f both
```

Atalho de exemplo (ajuste o caminho do `.md` ao seu repositório):

```bash
npm run export:example
```

### Sem instalar global: `npx` + pasta local

```bash
npx --yes -p file:/path/to/md-exporter md-export -i /path/to/doc.md -o ~/Downloads -f both
```

(Se `file:~/...` não expandir `~`, use caminho absoluto.)

---

## Preview do editor vs PDF/HTML gerado

O **md-to-pdf** não copia o tema do Cursor/VS Code. Para algo mais parecido com a preview:

1. **Markdown Preview Enhanced** → preview → clique direito → **Chrome (Puppeteer) → PDF** ou **HTML (offline)**  
2. Ou extensão **Markdown PDF** (`yzane.markdown-pdf`)

---

## Requisitos

- Node.js 18+ recomendado  
- Na primeira execução o Puppeteer pode baixar o Chromium (pode demorar).

---

## Estrutura típica num monorepo

```text
meu-monorepo/
  docs/                 ← .md e imagens
  ferramentas/md-exporter/   ← este projeto (npm install + npm install -g …)
```

Saída: `nome-do-arquivo.pdf` e/ou `nome-do-arquivo.html` na pasta indicada por `-o`.
