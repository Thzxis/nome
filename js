 // Dados da Bíblia com os capítulos, normalizados sem acentos para busca
  const LIVROS_DA_BIBLIA = {
    "genesis": 50, "exodo": 40, "levitico": 27, "numeros": 36, "deuteronomio": 34,
    "josue": 24, "juizes": 21, "rute": 4, "1 samuel": 31, "2 samuel": 24, "1 reis": 22,
    "2 reis": 25, "1 cronicas": 29, "2 cronicas": 36, "esdras": 10, "neemias": 13,
    "ester": 10, "jo": 42, "salmos": 150, "proverbios": 31, "eclesiastes": 12,
    "cantares": 8, "isaias": 66, "jeremias": 52, "lamentacoes": 5, "ezequiel": 48,
    "daniel": 12, "oseias": 14, "joel": 3, "amos": 9, "obadias": 1, "jonas": 4,
    "miqueias": 7, "naum": 3, "habacuque": 3, "sofonias": 3, "ageu": 2, "zacarias": 14,
    "malaquias": 4, "mateus": 28, "marcos": 16, "lucas": 24, "joao": 21, "atos": 28,
    "romanos": 16, "1 corintios": 16, "2 corintios": 13, "galatas": 6, "efesios": 6,
    "filipenses": 4, "colossenses": 4, "1 tessalonicenses": 5, "2 tessalonicenses": 3,
    "1 timoteo": 6, "2 timoteo": 4, "tito": 3, "filemom": 1, "hebreus": 13, "tiago": 5,
    "1 pedro": 5, "2 pedro": 3, "1 joao": 5, "2 joao": 1, "3 joao": 1, "judas": 1, "apocalipse": 22
  };

  // Função para remover acentos e normalizar texto para busca
  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace('crônicas', 'cronicas')
      .trim();
  }

  // Função que gera texto formatado do plano de leitura semanal
  function gerarPlanoSemanal(nomeLivro, totalCapitulos) {
    const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const diasDeLeitura = 6;
    let output = '';
    output += '-'.repeat(40) + '\n';
    output += `PLANO DE LEITURA SEMANAL: ${nomeLivro.toUpperCase()}\n`;
    output += '-'.repeat(40) + '\n';

    if (totalCapitulos < diasDeLeitura) {
      for(let i = 0; i < totalCapitulos; i++) {
        output += `${diasDaSemana[i].padEnd(15)} | Capítulo ${i + 1}\n`;
      }
      output += '-'.repeat(40) + '\n\n';
      return output;
    }

    // divisão principal do plano
    const capitulosBasePorDia = Math.floor(totalCapitulos / diasDeLeitura);
    const diasComCapituloExtra = totalCapitulos % diasDeLeitura;
    let capituloAtual = 1;

    for(let i = 0; i < diasDeLeitura; i++) {
      const capsNesteDia = capitulosBasePorDia + (i < diasComCapituloExtra ? 1 : 0);
      const capInicio = capituloAtual;
      const capFim = capituloAtual + capsNesteDia -1;

      if (capsNesteDia === 1) {
        output += `${diasDaSemana[i].padEnd(15)} | Capítulo ${capInicio}\n`;
      } else {
        output += `${diasDaSemana[i].padEnd(15)} | Capítulos ${capInicio}–${capFim}\n`;
      }
      capituloAtual = capFim + 1;
    }

    output += '-'.repeat(40) + '\n\n';
    return output;
  }

  // Controle do app
  document.addEventListener('DOMContentLoaded', () => {
    const inputLivro = document.getElementById('input-livro');
    const btnGerar = document.getElementById('btn-gerar');
    const btnTodos = document.getElementById('btn-todos');
    const btnLimpar = document.getElementById('btn-limpar');
    const output = document.getElementById('output');

    function limparOutput() {
      output.textContent = '';
      inputLivro.value = '';
      inputLivro.focus();
    }

    btnLimpar.addEventListener('click', () => {
      limparOutput();
    });

    btnGerar.addEventListener('click', () => {
      const entrada = inputLivro.value.trim();
      if (!entrada) {
        output.textContent = 'Por favor, digite o nome de um livro ou clique em Mostrar Todos.';
        return;
      }
      const nomeNormalizado = normalizarTexto(entrada);
      if (nomeNormalizado === 'todos') {
        // usar o comportamento do botão mostrar todos para consistência
        btnTodos.click();
        return;
      }
      const totalCapitulos = LIVROS_DA_BIBLIA[nomeNormalizado];
      if (totalCapitulos) {
        output.textContent = gerarPlanoSemanal(nomeNormalizado, totalCapitulos);
      } else {
        output.textContent = `Livro '${entrada}' não encontrado. Por favor, verifique o nome e tente novamente.`;
      }
      output.focus();
    });

    btnTodos.addEventListener('click', () => {
      let planos = '';
      for (const livro in LIVROS_DA_BIBLIA) {
        planos += gerarPlanoSemanal(livro, LIVROS_DA_BIBLIA[livro]);
      }
      output.textContent = planos;
      output.focus();
    });

    // Suporte enter no campo texto para disparar o plano
    inputLivro.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        btnGerar.click();
      }
    });
  });
