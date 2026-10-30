// Gera docs/referencia/*.md a partir do openapi.yaml.
// Uso: npm install --no-save js-yaml && node scripts/gerar-referencia.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const raiz = path.join(__dirname, '..');
const spec = yaml.load(fs.readFileSync(path.join(raiz, 'openapi.yaml'), 'utf8'));
const baseUrl = spec.servers[0].url;
const metodos = ['get', 'post', 'put', 'delete'];
const paginas = {
  'Anúncios': 'anuncios', 'Inscrições': 'inscricoes', 'Leads': 'leads', 'Negócios': 'negocios',
  'Propostas': 'propostas', 'Messenger': 'messenger', 'Relatórios': 'relatorios',
};
const exemplosCaminho = { id: '123', hash: 'abc123', psid: '1234567890' };

const resolver = (no) => {
  if (!no || !no.$ref) return no;
  return resolver(no.$ref.replace('#/', '').split('/').reduce((o, k) => o[k], spec));
};

// Junta allOf num objeto só, com propriedades e obrigatórios somados.
function achatar(schema) {
  const s = resolver(schema) || {};
  if (!s.allOf) return s;
  const out = { type: 'object', properties: {}, required: [] };
  for (const parte of s.allOf.map(achatar)) {
    Object.assign(out.properties, parte.properties);
    out.required.push(...(parte.required || []));
  }
  return out;
}

function exemplo(schema) {
  const s = achatar(schema);
  if (s.example !== undefined) return s.example;
  if (s.type === 'array') return [exemplo(s.items)];
  if (s.type === 'object' || s.properties) {
    const o = {};
    for (const [k, v] of Object.entries(s.properties || {})) o[k] = exemplo(v);
    return o;
  }
  if (s.nullable) return null;
  if (s.enum) return s.enum[0];
  return { integer: 0, number: 0, boolean: false }[s.type] ?? 'texto';
}

// No corpo de exemplo entram só os obrigatórios e os campos com exemplo.
function corpoExemplo(schema) {
  const s = achatar(schema);
  const o = {};
  for (const [k, v] of Object.entries(s.properties || {})) {
    const campo = achatar(v);
    if ((s.required || []).includes(k) || campo.example !== undefined) o[k] = exemplo(v);
  }
  return o;
}

const tipo = (s) => {
  const c = achatar(s);
  if (c.type === 'array') return `${c.items ? achatar(c.items).type || 'object' : 'object'}[]`;
  return c.format === 'date' ? 'date' : c.type || 'object';
};

function descricao(s) {
  const c = achatar(s);
  const partes = [];
  if (c.description) partes.push(c.description);
  if (c.enum) partes.push(`Valores: ${c.enum.map((v) => `\`${v}\``).join(', ')}.`);
  if (c.default !== undefined) partes.push(`Padrão: \`${c.default}\`.`);
  if (c.minimum !== undefined && c.maximum !== undefined) partes.push(`De ${c.minimum} a ${c.maximum}.`);
  return partes.join(' ') || '-';
}

const curl = (metodo, caminho, corpo) => {
  const linhas = [`curl -X ${metodo.toUpperCase()} "${baseUrl}${caminho}" \\`];
  if (corpo) linhas.push('  -H "Content-Type: application/json" \\');
  linhas.push(`  -H "Authorization: Bearer SEU_TOKEN"${corpo ? ' \\' : ''}`);
  if (corpo) {
    const json = JSON.stringify(corpo, null, 2).replace(/'/g, "'\\''").split('\n').join('\n  ');
    linhas.push(`  -d '${json}'`);
  }
  return linhas.join('\n');
};

function operacao(caminho, metodo, comuns) {
  const op = spec.paths[caminho][metodo];
  const linhas = [`## ${op.summary}`, '', `\`${metodo.toUpperCase()} ${baseUrl}${caminho}\``, ''];
  if (op.description) linhas.push(op.description.trim(), '');

  const params = [...comuns, ...(op.parameters || [])].map(resolver);
  if (params.length) {
    linhas.push('### Parâmetros', '', '| Nome | Onde | Tipo | Obrigatório | Descrição |', '| --- | --- | --- | --- | --- |');
    for (const p of params) {
      const onde = p.in === 'path' ? 'URL' : 'Query';
      const desc = [p.description, descricao(p.schema) !== '-' ? descricao(p.schema) : ''].filter(Boolean).join(' ') || '-';
      linhas.push(`| \`${p.name}\` | ${onde} | ${tipo(p.schema)} | ${p.required ? 'Sim' : 'Não'} | ${desc} |`);
    }
    linhas.push('');
  }

  const corpoSchema = op.requestBody?.content['application/json'].schema;
  if (corpoSchema) {
    const s = achatar(corpoSchema);
    linhas.push('### Corpo da requisição', '', '| Campo | Tipo | Obrigatório | Descrição |', '| --- | --- | --- | --- |');
    for (const [k, v] of Object.entries(s.properties)) {
      linhas.push(`| \`${k}\` | ${tipo(v)} | ${(s.required || []).includes(k) ? 'Sim' : 'Não'} | ${descricao(v)} |`);
    }
    linhas.push('');
  }

  const caminhoExemplo = caminho.replace(/\{(\w+)\}/g, (_, n) => exemplosCaminho[n]);
  linhas.push('### Exemplo', '', '```bash', curl(metodo, caminhoExemplo, corpoSchema && corpoExemplo(corpoSchema)), '```', '');
  for (const ex of op['x-exemplos'] || []) {
    linhas.push(`**${ex.titulo}**`, '', '```bash', curl(metodo, ex.caminho || caminhoExemplo, ex.corpo), '```', '');
  }

  const sucesso = Object.keys(op.responses).find((c) => c.startsWith('2'));
  const schemaSucesso = op.responses[sucesso].content['application/json'].schema;
  linhas.push(`### Resposta (${sucesso})`, '', '```json', JSON.stringify(exemplo(schemaSucesso), null, 2), '```', '');

  const erros = Object.keys(op.responses).filter((c) => !c.startsWith('2'));
  if (erros.length) {
    linhas.push('### Erros', '', '| Código | Descrição |', '| --- | --- |');
    for (const c of erros) linhas.push(`| \`${c}\` | ${resolver(op.responses[c]).description} |`);
    linhas.push('');
  }
  return linhas;
}

const destino = path.join(raiz, 'docs', 'referencia');
let total = 0;
for (const tag of spec.tags) {
  const linhas = [`# ${tag.name}`, '', tag.description, ''];
  for (const [caminho, item] of Object.entries(spec.paths)) {
    for (const metodo of metodos) {
      if (item[metodo]?.tags.includes(tag.name)) {
        linhas.push(...operacao(caminho, metodo, item.parameters || []));
        total++;
      }
    }
  }
  fs.writeFileSync(path.join(destino, `${paginas[tag.name]}.md`), linhas.join('\n').trimEnd() + '\n');
}
console.log(`${total} operações em ${spec.tags.length} páginas`);
