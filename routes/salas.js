var express = require('express');
var router = express.Router();

const colours = [
    'r',
    'b'
]

const nypes = [
  "♥",
  "♦",
  "♣",
  "♠"
];

const cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

const fullCardsColours = nypes.map((nype) => {
  return cards.map((card) => card+nype)
}).reduce((a, b) => a.concat(b), []);

const fullCards = colours.map((colour) => {
  return fullCardsColours.map((card) => card+colour)
}).reduce((a, b) => a.concat(b), []);

console.log(fullCards)

let quantidadeBaralhos = 2;
let salas = []
let salaFechada = false
let monte = []
let mesa = []
let curingas = []
let jogadores = []

/* Listar dados da sala */
router.get('/', function(req, res, next) {
  res.json(
      {
        salaFechada: salaFechada,
        curingas: curingas,
        mesa: mesa,
        quantidadeMesa: mesa.length,
        jogadores: jogadores.map((jogador) => { return { nome: jogador.nome, quantidadeCartas: jogador.cartas.length} })
      }
  )
});

/* Reiniciar. */
router.post('/reiniciar', function(req, res, next) {
  quantidadeBaralhos = 2;
  salas = []
  salaFechada = false
  monte = []
  mesa = []
  curingas = []
  jogadores = []
  res.json()
});

/* Dados completos dados da sala */
router.get('/admin', function(req, res, next) {
  res.json(
      {
        salaFechada: salaFechada,
        curingas: curingas,
        monte: monte,
        quantidadeNonte: monte.length,
        mesa: mesa,
        quantidadeMesa: mesa.length,
        jogadores: jogadores
      }
  )
});

/* Embaralhar. */
router.post('/embaralhar', function(req, res, next) {
  const quantidade = req.body.quantidade;

  // Limpa jogadores
  jogadores.forEach((jogador) => {
    jogador.cartas = [];
  })
  // Limpa Mesa
  mesa = []

  // Limpa Curinga
  curingas = []

  // Embaralha e cria o monte
  monte = (fullCards.sort(() => .5 - Math.random()))

  // Distribui as cartas
  jogadores.forEach((jogador) => {
    jogador.cartas = monte.splice(0, quantidade).sort();
  })

  res.json({
    embaralhado: true
  })
});

/* Tirar Curinga. */
router.post('/curingas', function(req, res, next) {
  const quantidade = req.body.quantidade;

  // Embaralha e cria o monte
  curingas = monte.splice(0, quantidade)

  res.json({
    curingas: curingas
  })
});

/* Novo jogador. */
router.post('/entrar', function(req, res, next) {
  nome = req.body.nome;
  senha = Math.random() + Math.random();

  if (!salaFechada) {
    let novo = {
      nome: nome,
      senha: senha,
      cartas: []
    }
    jogadores.push(novo)
    res.json(novo)
  } else {
    res.json()
  }
});

/* Sair jogador. */
router.post('/sair', function(req, res, next) {
  nome = req.body.nome;
  senha = req.body.senha;

  jogadores = jogadores.filter((j) => { return !(j.nome.toString() === nome.toString() && j.senha.toString() === senha.toString()) })

  res.json()
});

/* Dar cartas. */
router.post('/cartas', function(req, res, next) {
  nome = req.body.nome
  senha = req.body.senha
  jogador = jogadores.filter((j) => { return j.nome.toString() === nome.toString() && j.senha.toString() === senha.toString() })
  if (jogador.length) {
    jogador = jogador[0]
    res.json({
      cartas: jogador.cartas
    })
  } else {
    res.json()
  }
});

/* Dar cartas. */
router.post('/jogar', function(req, res, next) {
  posicaoCarta = req.body.posicaoCarta
  nome = req.body.nome
  senha = req.body.senha
  jogador = jogadores.filter((j) => { return j.nome.toString() === nome.toString() && j.senha.toString() === senha.toString() })
  if (jogador.length) {
    jogador = jogador[0]
    mesa.push(jogador.cartas.splice(posicaoCarta,1))

    res.json({
      cartas: jogador.cartas
    })
  } else {
    res.json()
  }
});

module.exports = router;
