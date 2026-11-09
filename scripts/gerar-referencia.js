// Gera as páginas de referência a partir dos arquivos OpenAPI:
//   openapi.yaml             -> docs/referencia/*.md   (API do CRM, Configurações > API)
//   openapi-api-service.yaml -> docs/api-service/*.md  (API-Service, Configurações > API-Service)
// Uso: npm install --no-save js-yaml && node scripts/gerar-referencia.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const raiz = path.join(__dirname, '..');
const metodos = ['get', 'post', 'put', 'delete'];
const exemplosCaminho = { id: '123', hash: 'abc123', psid: '1234567890' };

const fontes = [
  {
    arquivo: 'openapi.yaml',
    destino: path.join('docs', 'referencia'),
    paginas: {
      'Formulários': 'formularios', 'Inscrições': 'inscricoes', 'Leads': 'leads', 'Negócios': 'negocios',
      'Propostas': 'propostas', 'Messenger': 'messenger', 'Relatórios': 'relatorios',
    },
  },
  {
    arquivo: 'openapi-api-service.yaml',
    destino: path.join('docs', 'api-service'),
    paginas: { 'Mensagens': 'mensagens', 'Templates': 'templates', 'Status da mensagem': 'status' },
  },
];

function gerar(fonte) {
  const spec = yaml.load(fs.readFileSync(path.join(raiz, fonte.arquivo), 'utf8'));
  const servidor = spec.servers[0];
  // URL mostrada mantém as variáveis do servidor ({apiId}); no curl entra o valor de exemplo.
  const baseUrl = servidor.url;
  const baseUrlExemplo = servidor.url.replace(/\{(\w+)\}/g, (m, n) => servidor.variables?.[n]?.default ?? m);

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
    if (c.format === 'binary') return 'file';
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

  // corpo = objeto JSON; form = lista de [campo, valor, éArquivo]; comToken = header Authorization.
  const curl = (metodo, caminho, { corpo, form, comToken = true } = {}) => {
    const linhas = [`curl -X ${metodo.toUpperCase()} "${baseUrlExemplo}${caminho}"`];
    if (corpo) linhas.push('  -H "Content-Type: application/json"');
    if (comToken) linhas.push('  -H "Authorization: Bearer SEU_TOKEN"');
    if (corpo) {
      const json = JSON.stringify(corpo, null, 2).replace(/'/g, "'\\''").split('\n').join('\n  ');
      linhas.push(`  -d '${json}'`);
    }
    for (const [k, v, arquivo] of form || []) linhas.push(`  -F "${k}=${arquivo ? '@' : ''}${v}"`);
    return linhas.join(' \\\n');
  };

  function tabelaCorpo(schema) {
    const s = achatar(schema);
    const linhas = ['| Campo | Tipo | Obrigatório | Descrição |', '| --- | --- | --- | --- |'];
    for (const [k, v] of Object.entries(s.properties)) {
      linhas.push(`| \`${k}\` | ${tipo(v)} | ${(s.required || []).includes(k) ? 'Sim' : 'Não'} | ${descricao(v)} |`);
    }
    return linhas;
  }

  // Campos do form-data de exemplo: obrigatórios e os que têm exemplo.
  function formExemplo(schema) {
    const s = achatar(schema);
    return Object.keys(corpoExemplo(schema)).map((k) => {
      const campo = achatar(s.properties[k]);
      return [k, exemplo(campo), campo.format === 'binary'];
    });
  }

  function operacao(caminho, metodo, comuns) {
    const op = spec.paths[caminho][metodo];
    // Rota "/" é a própria URL base (a API-Service não aceita barra no fim).
    const sufixo = caminho === '/' ? '' : caminho;
    const linhas = [`## ${op.summary}`, '', `\`${metodo.toUpperCase()} ${baseUrl}${sufixo}\``, ''];
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

    const conteudo = op.requestBody?.content || {};
    const corpoSchema = conteudo['application/json']?.schema;
    const formSchema = conteudo['multipart/form-data']?.schema;
    if (corpoSchema) linhas.push('### Corpo da requisição', '', ...tabelaCorpo(corpoSchema), '');

    let caminhoExemplo = sufixo.replace(/\{(\w+)\}/g, (_, n) => exemplosCaminho[n]);
    // Opcional: GET com os parâmetros de query obrigatórios já preenchidos no exemplo.
    if (op['x-query-no-exemplo']) {
      const query = params.filter((p) => p.in === 'query' && p.required)
        .map((p) => `${p.name}=${encodeURIComponent(p.example ?? p.schema?.example ?? '')}`);
      if (query.length) caminhoExemplo += `?${query.join('&')}`;
    }
    linhas.push('### Exemplo', '', '```bash', curl(metodo, caminhoExemplo, { corpo: corpoSchema && corpoExemplo(corpoSchema) }), '```', '');
    for (const ex of op['x-exemplos'] || []) {
      linhas.push(`**${ex.titulo}**`, '', '```bash', curl(metodo, ex.caminho || caminhoExemplo, { corpo: ex.corpo, comToken: !ex.semToken }), '```', '');
    }

    if (formSchema) {
      linhas.push(`### ${op['x-titulo-form'] || 'Corpo da requisição (form-data)'}`, '');
      if (op['x-descricao-form']) linhas.push(op['x-descricao-form'].trim(), '');
      linhas.push(...tabelaCorpo(formSchema), '', '```bash', curl(metodo, caminhoExemplo, { form: formExemplo(formSchema) }), '```', '');
    }

    const sucesso = Object.keys(op.responses).find((c) => c.startsWith('2'));
    const schemaSucesso = resolver(op.responses[sucesso]).content['application/json'].schema;
    linhas.push(`### Resposta (${sucesso})`, '', '```json', JSON.stringify(exemplo(schemaSucesso), null, 2), '```', '');

    const erros = Object.keys(op.responses).filter((c) => !c.startsWith('2'));
    if (erros.length) {
      linhas.push('### Erros', '', '| Código | Descrição |', '| --- | --- |');
      for (const c of erros) linhas.push(`| \`${c}\` | ${resolver(op.responses[c]).description.trim()} |`);
      linhas.push('');
    }
    return linhas;
  }

  const destino = path.join(raiz, fonte.destino);
  fs.mkdirSync(destino, { recursive: true });
  let total = 0;
  for (const tag of spec.tags) {
    const linhas = [`# ${tag.name}`, '', tag.description.trim(), ''];
    for (const [caminho, item] of Object.entries(spec.paths)) {
      for (const metodo of metodos) {
        if (item[metodo]?.tags.includes(tag.name)) {
          linhas.push(...operacao(caminho, metodo, item.parameters || []));
          total++;
        }
      }
    }
    fs.writeFileSync(path.join(destino, `${fonte.paginas[tag.name]}.md`), linhas.join('\n').trimEnd() + '\n');
  }
  console.log(`${fonte.arquivo}: ${total} operações em ${spec.tags.length} páginas`);
}

fontes.forEach(gerar);
