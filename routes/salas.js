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

console.log('Baralho Iniciado:'  + nypes)

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
        jogadores: jogadores.map((jogador) => { return {
          nome: jogador.nome,
          quantidadeCartas: jogador.cartas.length,
          pontosRodada: jogador.pontosRodada,
          previsaoRodada: jogador.previsaoRodada,
          dealer: jogador.dealer,
          admin: jogador.admin
        } })
      }
  )
});

/* Reiniciar. */
router.get('/reiniciar', function(req, res, next) {
  salas = []
  salaFechada = false
  monte = []
  mesa = []
  curingas = []
  jogadores = []
  res.json()
});

/* Reiniciar. */
router.get('/novaPartida', function(req, res, next) {
  monte = []
  mesa = []
  curingas = []
  // Limpa jogadore
  jogadores.forEach((j) => {
    j.admin = false
    j.dealer = false
    j.cartas = []
    j.pontosRodada = 0
    j.previsaoRodada = 0
  })
  res.json()
})


// /* Dados completos dados da sala */
// router.get('/admin', function(req, res, next) {
//   res.json(
//       {
//         salaFechada: salaFechada,
//         curingas: curingas,
//         monte: monte,
//         quantidadeNonte: monte.length,
//         mesa: mesa,
//         quantidadeMesa: mesa.length,
//         jogadores: jogadores
//       }
//   )
// });

/* Embaralhar. */
router.post('/embaralhar', function(req, res, next) {
  const quantidade = parseInt(req.body.quantidade);
  const nome = req.body.nome;
  const senha = req.body.senha;

  if (quantidade > 0) {
    // Limpa jogadores
    jogadores.forEach((j) => {
      j.cartas = [];
      j.pontosRodada = 0
      j.previsaoRodada = 0
      j.dealer = false
    })

    let jogador = identificarJogador(nome, senha)

    // Seta dealer
    jogador.dealer = true

    // Limpa Mesa
    mesa = []

    // Limpa Curinga
    curingas = []

    // Embaralha e cria o monte
    monte = []
    Object.assign(monte, fullCards.sort(() => .5 - Math.random()))

    // Distribui as cartas
    jogadores.forEach((j) => {
      j.cartas = monte.splice(0, quantidade).sort();
    })

    // Tirar Curinga
    curingas = monte.splice(0, 1)

    res.json({
      embaralhado: true
    })
  } else {
    res.json({
      embaralhado: false
    })
  }
});

/* Setar ganhador da rodada. */
router.post('/setarGanhador', function(req, res, next) {
  const posicaoCartaVencedora = req.body.posicaoCartaVencedora;

  // só permite setar ganhador quanto todos tiverem jogado na mesa
  if (mesa.length === jogadores.length) {
    let cartaVencedora = mesa.slice(posicaoCartaVencedora, posicaoCartaVencedora+1)
    let nome = cartaVencedora[0].jogador

    // identifica jogador da carta vencedora e soma ponto
    let jogador = jogadores.filter((j) => { return (j.nome.toString() === nome.toString()) })
    if (jogador.length > 0) {
      jogador[0].pontosRodada += 1
    }

    mesa = []
  }

  res.json()
});

/* Novo jogador. */
router.post('/entrar', function(req, res, next) {
  const nome = req.body.nome;
  const senha = Math.random() + Math.random();

  if (!salaFechada) {
    let novo = {
      admin: false,
      nome: nome,
      senha: senha,
      cartas: [],
      dealer: false,
      pontosRodada: 0,
      previsaoRodada: 0,
    }
    jogadores.push(novo)
    res.json(novo)
  } else {
    res.json()
  }
});

/* Sair jogador. */
router.post('/sair', function(req, res, next) {
  const nome = req.body.nome;
  const senha = req.body.senha;

  jogadores = jogadores.filter((j) => { return !(j.nome.toString() === nome.toString() && j.senha.toString() === senha.toString()) })

  res.json()
});

/* Sair jogador. */
router.post('/virarAdmin', function(req, res, next) {
  const nome = req.body.nome;
  const senha = req.body.senha;

  // Setar jogador como dealer
  jogadores.forEach((j) => {
    j.admin = false
  })
  let jogador = identificarJogador(nome, senha)
  jogador.admin = true

  res.json()
});

/* Ver cartas. */
router.post('/minhasCartas', function(req, res, next) {
  const nome = req.body.nome
  const senha = req.body.senha
  const jogador = identificarJogador(nome, senha)

  if (jogador) {
    res.json({
      cartas: jogador.cartas,
      dealer: jogador.dealer,
      admin: jogador.admin
    })
  } else {
    res.json()
  }
});

/* Jogar. */
router.post('/jogar', function(req, res, next) {
  const posicaoCarta = parseInt(req.body.posicaoCarta)
  const nome = req.body.nome
  const senha = req.body.senha
  let jogador = identificarJogador(nome, senha)

  if (jogador && posicaoCarta >= 0) {
    mesa.push(
        {
          carta: jogador.cartas.splice(posicaoCarta, 1)[0],
          jogador: nome
        }
    )

    res.json({
      cartas: jogador.cartas
    })
  } else {
    res.json()
  }
});

/* Nova Rodada. */
router.post('/novaRodada', function(req, res, next) {
  mesa = []
  res.json()
});

const identificarJogador = (nome, senha) => {
  let jogador = jogadores.filter((j) => { return j.nome.toString() === nome.toString() && j.senha.toString() === senha.toString() })
  if (jogador.length > 0) {
    return jogador[0]
  } else {
    return null
  }

}
module.exports = router;
