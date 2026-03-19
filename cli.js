#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

const HTML_EXPORT_CSS = [
	'html { box-sizing: border-box; font-size: calc(100% + 1pt); }',
	'body { padding: 20px; box-sizing: border-box; }',
	'*, *::before, *::after { box-sizing: inherit; }'
].join(' ');

const expandHome = (p) => {
	if (typeof p !== 'string') return p;
	if (p === '~') return os.homedir();
	if (p.startsWith('~/') || p.startsWith('~\\')) {
		return path.join(os.homedir(), p.slice(2));
	}
	return p;
};

const resolvePath = (p) => path.resolve(process.cwd(), expandHome(p));

const printHelp = () => {
	console.log(`
md-exporter — Markdown → PDF e/ou HTML (md-to-pdf / Chromium)

Uso:
  node cli.js <arquivo.md> [pasta-saída] [pdf|html|both]
  node cli.js -i <arquivo.md> [-o pasta] [-f pdf|html|both]

Opções:
  -i, --input     Caminho do arquivo .md (obrigatório se não usar forma posicional)
  -o, --output    Diretório de saída (padrão: ./output). Aceita ~/Downloads
  -f, --format    pdf | html | both (padrão: both)
  -h, --help      Esta ajuda

Forma posicional (útil com npm run):
  node cli.js ../docs/doc.md ~/Downloads both

npm run export — IMPORTANTE:
  O npm interpreta -f como --force e pode comer -i/-o. Use -- antes dos argumentos:
  npm run export -- -i ../docs/doc.md -o ~/Downloads -f both

  Ou só posicionais (sem -- também funciona em muitas versões do npm):
  npm run export -- ../docs/doc.md ~/Downloads both

O diretório base para assets (imagens) é a pasta do .md.

Exemplos:
  node cli.js -i ../docs/checkout-docs.md -o ./dist -f pdf
  node cli.js ../docs/checkout-docs.md ~/Downloads both
`);
};

const parseArgs = (argv) => {
	const args = {
		input: null,
		output: path.resolve(process.cwd(), 'output'),
		format: 'both'
	};
	const positional = [];

	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		const next = () => {
			const v = argv[++i];
			if (v === undefined) throw new Error(`Falta valor após ${a}`);
			return v;
		};

		if (a === '-h' || a === '--help') {
			args.help = true;
			continue;
		}
		if (a === '-i' || a === '--input') {
			args.input = resolvePath(next());
			continue;
		}
		if (a === '-o' || a === '--output') {
			args.output = resolvePath(next());
			continue;
		}
		if (a === '-f' || a === '--format') {
			const f = next().toLowerCase();
			if (!['pdf', 'html', 'both'].includes(f)) {
				throw new Error(`--format deve ser pdf, html ou both (recebido: ${f})`);
			}
			args.format = f;
			continue;
		}
		if (a.startsWith('-')) {
			throw new Error(`Opção desconhecida: ${a}`);
		}
		positional.push(a);
	}

	if (!args.input && positional.length > 0) {
		args.input = resolvePath(positional.shift());
	}

	if (positional.length > 0) {
		const maybeOut = positional.shift();
		const maybeFmt = positional.shift();
		if (positional.length > 0) {
			throw new Error(
				'Argumentos demais. Use: arquivo.md [pasta-saída] [pdf|html|both]'
			);
		}
		if (maybeFmt !== undefined) {
			const f = maybeFmt.toLowerCase();
			if (!['pdf', 'html', 'both'].includes(f)) {
				throw new Error(
					`Formato inválido "${maybeFmt}". Use pdf, html ou both.`
				);
			}
			args.format = f;
		}
		if (maybeOut !== undefined) {
			args.output = resolvePath(maybeOut);
		}
	}

	return args;
};

const run = async () => {
	let args;
	try {
		args = parseArgs(process.argv.slice(2));
	} catch (e) {
		console.error(e.message || e);
		process.exit(1);
	}

	if (args.help || process.argv.length <= 2) {
		printHelp();
		process.exit(args.help ? 0 : 1);
	}

	if (!args.input) {
		console.error('Erro: informe o arquivo .md com -i ou como primeiro argumento.\n');
		printHelp();
		process.exit(1);
	}

	if (!fs.existsSync(args.input)) {
		console.error(`Erro: arquivo não encontrado: ${args.input}`);
		process.exit(1);
	}

	const ext = path.extname(args.input).toLowerCase();
	if (ext !== '.md' && ext !== '.markdown') {
		console.warn(`Aviso: extensão "${ext || '(nenhuma)'}" — esperado .md`);
	}

	fs.mkdirSync(args.output, { recursive: true });

	const baseName = path.basename(args.input, ext || '.md');
	const basedir = path.dirname(args.input);

	const doPdf = args.format === 'pdf' || args.format === 'both';
	const doHtml = args.format === 'html' || args.format === 'both';

	const destPdf = path.join(args.output, `${baseName}.pdf`);
	const destHtml = path.join(args.output, `${baseName}.html`);

	try {
		if (doPdf) {
			console.log(`PDF → ${destPdf}`);
			await mdToPdf(
				{ path: args.input },
				{ dest: destPdf, basedir }
			);
		}
		if (doHtml) {
			console.log(`HTML → ${destHtml}`);
			await mdToPdf(
				{ path: args.input },
				{ dest: destHtml, basedir, as_html: true, css: HTML_EXPORT_CSS }
			);
		}
		console.log('Concluído.');
	} catch (err) {
		console.error('Falha na exportação:', err.message || err);
		process.exit(1);
	}
};

run();
