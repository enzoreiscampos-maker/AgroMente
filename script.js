/**
 * AgroMente — script.js
 * Quiz interativo sobre agricultura, sustentabilidade e tecnologia
 */

// =============================================
// 1. BANCO DE QUESTÕES
// =============================================
const questoes = [
  {
    pergunta: "Qual é a principal função da agricultura?",
    opcoes: [
      "Produzir alimentos",
      "Construir estradas",
      "Fabricar carros",
      "Produzir computadores"
    ],
    correta: 0 // índice da alternativa correta
  },
  {
    pergunta: "O que significa sustentabilidade?",
    opcoes: [
      "Utilizar recursos de forma responsável",
      "Gastar todos os recursos disponíveis",
      "Produzir mais lixo",
      "Evitar qualquer tecnologia"
    ],
    correta: 0
  },
  {
    pergunta: "Qual tecnologia ajuda no monitoramento das lavouras?",
    opcoes: [
      "Televisão",
      "Rádio",
      "Drones",
      "Calculadora"
    ],
    correta: 2
  },
  {
    pergunta: "O que é agricultura de precisão?",
    opcoes: [
      "Plantar sem planejamento",
      "Uso de tecnologia para melhorar a produção",
      "Produzir apenas manualmente",
      "Não utilizar dados"
    ],
    correta: 1
  },
  {
    pergunta: "Qual recurso natural é essencial para a agricultura?",
    opcoes: [
      "Concreto",
      "Plástico",
      "Asfalto",
      "Água"
    ],
    correta: 3
  },
  {
    pergunta: "O que ajuda a preservar o solo?",
    opcoes: [
      "Cobertura vegetal",
      "Queimadas frequentes",
      "Desmatamento",
      "Poluição"
    ],
    correta: 0
  },
  {
    pergunta: "Qual energia é considerada renovável?",
    opcoes: [
      "Petróleo",
      "Energia solar",
      "Carvão",
      "Diesel"
    ],
    correta: 1
  },
  {
    pergunta: "Por que as árvores são importantes?",
    opcoes: [
      "Apenas produzem sombra",
      "Consomem toda a água",
      "Ajudam a equilibrar o ambiente",
      "Não têm utilidade"
    ],
    correta: 2
  },
  {
    pergunta: "O que a tecnologia pode trazer para o campo?",
    opcoes: [
      "Menos conhecimento",
      "Mais desperdício",
      "Menos organização",
      "Mais eficiência na produção"
    ],
    correta: 3
  },
  {
    pergunta: "Qual atitude contribui para um futuro melhor?",
    opcoes: [
      "Desperdiçar água",
      "Preservar os recursos naturais",
      "Poluir rios",
      "Desmatar áreas verdes"
    ],
    correta: 1
  }
];

// =============================================
// 2. ESTADO DO QUIZ
// =============================================
let indiceAtual   = 0;   // questão atual (0–9)
let pontuacao     = 0;   // total de acertos
let respondida    = false; // impede avançar sem responder
let opcaoSelecionada = null; // índice da opção escolhida

// =============================================
// 3. REFERÊNCIAS AOS ELEMENTOS DA DOM
// =============================================
const screenStart    = document.getElementById('screenStart');
const screenQuestion = document.getElementById('screenQuestion');
const screenResult   = document.getElementById('screenResult');

const btnStart       = document.getElementById('btnStart');
const btnNext        = document.getElementById('btnNext');
const btnRestart     = document.getElementById('btnRestart');

const progressFill   = document.getElementById('progressFill');
const progressLabel  = document.getElementById('progressLabel');
const liveScore      = document.getElementById('liveScore');
const questionText   = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackBox    = document.getElementById('feedbackBox');

const resultEmoji    = document.getElementById('resultEmoji');
const resultTitle    = document.getElementById('resultTitle');
const resultMessage  = document.getElementById('resultMessage');
const resultAcertos  = document.getElementById('resultAcertos');
const resultPercent  = document.getElementById('resultPercent');
const resultBar      = document.getElementById('resultBar');

// =============================================
// 4. INICIAR QUIZ
// =============================================
btnStart.addEventListener('click', () => {
  indiceAtual      = 0;
  pontuacao        = 0;
  respondida       = false;
  opcaoSelecionada = null;

  mostrarTela(screenQuestion);
  renderizarQuestao();
});

// =============================================
// 5. RENDERIZAR QUESTÃO
// =============================================
function renderizarQuestao() {
  const questao = questoes[indiceAtual];

  // Atualiza progresso
  const progresso = ((indiceAtual) / questoes.length) * 100;
  progressFill.style.width = progresso + '%';
  progressLabel.textContent = `Questão ${indiceAtual + 1} de ${questoes.length}`;

  // Pontuação ao vivo
  liveScore.textContent = pontuacao;

  // Enunciado (animação de entrada)
  questionText.textContent = questao.pergunta;
  questionText.style.animation = 'none';
  void questionText.offsetWidth; // reflow para reiniciar animação
  questionText.style.animation = '';

  // Letras das alternativas
  const letras = ['A', 'B', 'C', 'D'];

  // Limpa opções anteriores
  optionsContainer.innerHTML = '';

  // Cria botões para cada opção
  questao.opcoes.forEach((opcao, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerHTML = `<span class="option-letter">${letras[i]}</span> ${opcao}`;
    btn.addEventListener('click', () => selecionarOpcao(i, btn));
    optionsContainer.appendChild(btn);
  });

  // Esconde feedback e botão próxima
  feedbackBox.classList.add('hidden');
  btnNext.classList.add('hidden');
  btnNext.classList.remove('btn--next'); // reset visual
  btnNext.classList.add('btn--next');

  respondida       = false;
  opcaoSelecionada = null;
}

// =============================================
// 6. SELECIONAR OPÇÃO
// =============================================
function selecionarOpcao(indice, btnClicado) {
  // Não permite mudar após confirmar
  if (respondida) return;

  // Remove seleção anterior
  const todosOsBotoes = optionsContainer.querySelectorAll('.option-btn');
  todosOsBotoes.forEach(b => b.classList.remove('selected'));

  // Marca o clicado
  btnClicado.classList.add('selected');
  opcaoSelecionada = indice;

  // Mostra botão "Próxima" assim que algo for selecionado
  btnNext.classList.remove('hidden');
}

// =============================================
// 7. PRÓXIMA QUESTÃO
// =============================================
btnNext.addEventListener('click', () => {

  // Impede avançar sem selecionar
  if (opcaoSelecionada === null) {
    mostrarAlerta();
    return;
  }

  // Já respondida (não deveria chegar aqui, mas por segurança)
  if (respondida) return;

  respondida = true;
  const questao = questoes[indiceAtual];
  const correta  = questao.correta;
  const botoesOpcao = optionsContainer.querySelectorAll('.option-btn');

  // Desabilita todos os botões
  botoesOpcao.forEach(b => b.disabled = true);

  // Verifica acerto
  if (opcaoSelecionada === correta) {
    pontuacao++;
    botoesOpcao[opcaoSelecionada].classList.remove('selected');
    botoesOpcao[opcaoSelecionada].classList.add('correct');
    mostrarFeedback(true);
  } else {
    botoesOpcao[opcaoSelecionada].classList.remove('selected');
    botoesOpcao[opcaoSelecionada].classList.add('wrong');
    botoesOpcao[correta].classList.add('correct');
    mostrarFeedback(false, questao.opcoes[correta]);
  }

  // Atualiza pontuação ao vivo imediatamente
  liveScore.textContent = pontuacao;

  // Muda o texto do botão
  if (indiceAtual < questoes.length - 1) {
    btnNext.textContent = 'Próxima →';
  } else {
    btnNext.textContent = 'Ver Resultado 🏆';
  }

  // Próxima ação no clique seguinte
  btnNext.removeEventListener('click', avancar); // evita duplicação
  btnNext.addEventListener('click', avancar, { once: true });
});

// =============================================
// 8. AVANÇAR PARA PRÓXIMA OU RESULTADO
// =============================================
function avancar() {
  indiceAtual++;

  if (indiceAtual < questoes.length) {
    // Próxima questão
    renderizarQuestao();

    // Reanexa o listener principal
    btnNext.addEventListener('click', confirmarResposta);
  } else {
    // Fim do quiz
    mostrarResultado();
  }
}

// Listener de confirmação de resposta (referência para poder remover)
function confirmarResposta() {
  // Este event listener é substituído dinamicamente; mantido para referência
}

// =============================================
// 9. FEEDBACK VISUAL
// =============================================
function mostrarFeedback(acertou, respostaCorreta = '') {
  feedbackBox.classList.remove('hidden', 'correct-fb', 'wrong-fb');

  if (acertou) {
    feedbackBox.classList.add('correct-fb');
    feedbackBox.textContent = '✅ Correto! Ótimo trabalho!';
  } else {
    feedbackBox.classList.add('wrong-fb');
    feedbackBox.textContent = `❌ Incorreto. A resposta certa é: "${respostaCorreta}"`;
  }
}

// =============================================
// 10. ALERTA DE NÃO SELEÇÃO
// =============================================
function mostrarAlerta() {
  feedbackBox.classList.remove('hidden', 'correct-fb', 'wrong-fb');
  feedbackBox.classList.add('wrong-fb');
  feedbackBox.textContent = '⚠️ Selecione uma alternativa antes de continuar.';

  // Esconde o alerta automaticamente após 2s
  setTimeout(() => {
    if (!respondida) feedbackBox.classList.add('hidden');
  }, 2000);
}

// =============================================
// 11. MOSTRAR RESULTADO FINAL
// =============================================
function mostrarResultado() {
  // Atualiza barra de progresso para 100%
  progressFill.style.width = '100%';

  mostrarTela(screenResult);

  const total    = questoes.length;
  const percent  = Math.round((pontuacao / total) * 100);

  // Preenche dados
  resultAcertos.textContent = `${pontuacao}/${total}`;
  resultPercent.textContent = `${percent}%`;

  // Barra de desempenho (com delay para animar)
  setTimeout(() => {
    resultBar.style.width = percent + '%';

    // Cor da barra conforme desempenho
    if (percent >= 80) {
      resultBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
    } else if (percent >= 40) {
      resultBar.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
    } else {
      resultBar.style.background = 'linear-gradient(90deg, #e74c3c, #e67e22)';
    }
  }, 200);

  // Mensagem conforme pontuação
  if (pontuacao <= 3) {
    resultEmoji.textContent   = '📚';
    resultTitle.textContent   = 'Continue aprendendo!';
    resultMessage.textContent = 'Cada erro é uma oportunidade de crescer. Explore mais sobre agricultura, sustentabilidade e tecnologia!';
  } else if (pontuacao <= 7) {
    resultEmoji.textContent   = '🌱';
    resultTitle.textContent   = 'Bom trabalho!';
    resultMessage.textContent = 'Você já tem um bom entendimento do tema! Com um pouco mais de estudo, chegará ao topo.';
  } else {
    resultEmoji.textContent   = '🏆';
    resultTitle.textContent   = 'Excelente! Você domina o tema!';
    resultMessage.textContent = 'Parabéns! Seu conhecimento sobre campo, sustentabilidade e inovação é impressionante!';
  }
}

// =============================================
// 12. JOGAR NOVAMENTE
// =============================================
btnRestart.addEventListener('click', () => {
  indiceAtual      = 0;
  pontuacao        = 0;
  respondida       = false;
  opcaoSelecionada = null;

  // Reseta barra de resultado
  resultBar.style.width = '0%';

  mostrarTela(screenStart);
});

// =============================================
// 13. HELPER — ALTERNAR TELAS
// =============================================
function mostrarTela(tela) {
  // Esconde todas as telas
  [screenStart, screenQuestion, screenResult].forEach(t => {
    t.classList.add('hidden');
  });
  // Exibe a tela desejada
  tela.classList.remove('hidden');
}
