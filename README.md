# md-exporter

CLI genérico para gerar **PDF** e/ou **HTML** a partir de qualquer arquivo **Markdown**, usando [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) (Chromium headless).

## Instalação

```bash
cd koin/md-exporter
npm install
```

## Uso

```bash
node cli.js --input <arquivo.md> [--output <diretório>] [--format pdf|html|both]
```

| Opção | Abreviação | Padrão | Descrição |
|-------|------------|--------|-----------|
| `--input` | `-i` | — | Caminho do `.md` (**obrigatório**) |
| `--output` | `-o` | `./output` | Pasta onde gravar os arquivos (é criada se não existir) |
| `--format` | `-f` | `both` | `pdf`, `html` ou `both` |
| `--help` | `-h` | — | Ajuda |

O **basedir** para imagens e links relativos é sempre a **pasta do arquivo `.md`**, para `./figura.png` e similares funcionarem.

### Exemplos

```bash
# PDF + HTML em ./output (padrão)
node cli.js -i ../docs/checkout-docs.md

# Flags com ~ no output
node cli.js -i ../docs/checkout-docs.md -o ~/Downloads -f both

# Forma posicional: arquivo → pasta → formato (evita confusão com npm)
node cli.js ../docs/checkout-docs.md ~/Downloads both

# Só PDF
node cli.js -i ../docs/checkout-docs.md -o ~/Desktop/exports -f pdf
```

### `npm run export` e o `--`

O **npm** reserva `-f` para **--force** e pode não repassar `-i` / `-o` ao script. Por isso apareceu saída em `./output` mesmo pedindo `~/Downloads`.

**Sempre use `--` antes dos argumentos do `cli.js` quando usar flags:**

```bash
npm run export -- -i ../docs/checkout-docs.md -o ~/Downloads -f both
```

**Ou** use a forma **posicional** (só precisa de um `--` entre `export` e os args):

```bash
npm run export -- ../docs/checkout-docs.md ~/Downloads both
```

Com **bin** do npm:

```bash
npx md-export -i ../docs/checkout-docs.md -o ~/Downloads -f both
```

### Atalho opcional (checkout)

```bash
npm run export:checkout
```

Equivale a exportar `../docs/checkout-docs.md` para `./output` em PDF e HTML.

## Fidelidade ao preview do Cursor/VS Code

O **md-to-pdf** não replica tema/CSS do editor. Para resultado mais próximo do preview:

1. **Markdown Preview Enhanced** → preview da extensão → clique direito → **Chrome (Puppeteer) → PDF** ou **HTML (offline)**.
2. Ou extensão **Markdown PDF** (`yzane.markdown-pdf`).

## Requisitos

- Node.js 18+ recomendado  
- Na primeira execução o Puppeteer pode baixar o Chromium.

## Estrutura sugerida no monorepo

```
koin/
  docs/              ← documentação (.md, imagens)
  md-exporter/       ← esta CLI (npm install aqui)
```

Saída típica: arquivos com o **mesmo nome base** do `.md` (ex.: `guia.md` → `guia.pdf` / `guia.html`).
