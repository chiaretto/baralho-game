<template>
    <div id="app">
        <nav id="navbar-example" class="navbar navbar-light bg-light">
            <span id="curinga">
                <div class="card" v-for="item in curingas" :key="item"
                     :class="(quemTemPoe) ? 'quemTemPoe ' + extrairNype(item) : extrairNype(item)"
                     >
                    <p>{{ extrairCarta(item) }}</p>
                </div>
            </span>
            <span id="jogadores">
                <div class="jogador" :title="item.admin ? 'Admin' : ''" :class="item.dealer ? 'dealer' : ''" v-for="(item, index) in jogadores" :key="item.nome">
                    <span class="foto">
                        <img :src="'https://avatars.dicebear.com/api/bottts/'+item.nome+'.png'" alt="">
                    </span>
                    <span class="nome" :class="item.admin ? 'admin' : ''">{{ item.nome }}</span>
                    <span title="Quantidade cartas" class="qtdCartas badge" :class="'cor-'+item.quantidadeCartas">{{ item.quantidadeCartas }}</span>
                    <span title="Vitorias" class="qtdPontos badge badge-dark">{{ item.pontosRodada }}</span>
                    <span title="Previsao" class="previsao badge badge-light">{{ item.previsaoRodada }}</span>
                    <span title="Total" class="totalPontos badge badge-dark">{{ item.pontosTotal }}</span>
                    <span class="removerJogador" @click="removerJogador(index)" v-if="isAdmin && !item.admin">Remover</span>
                </div>
            </span>

            <ul class="nav nav-pills">
                <li class="nav-item">
                    <input v-if="estaLogado" @click="embaralhar()" class="btn btn-sm btn-success" type="button" value="Dar Cartas">
                </li>
                <li class="nav-item">
                    <input v-if="estaLogado && !existeAdmin" @click="virarAdmin()" class="btn btn-sm btn-warning" type="button" value="Virar Admin">
                    <input v-if="estaLogado && existeAdmin && this.isAdmin" @click="largarAdmin()" class="btn btn-sm btn-warning" type="button" value="Largar Admin">
                </li>
                <li class="nav-item">
                    <button v-if="!estaLogado"  @click="entrar()" type="button" class="btn btn-sm btn-primary">Entrar</button>
                    <input v-if="estaLogado" @click="sair()" class="btn btn-sm btn-danger" type="button" value="Sair">
                </li>
            </ul>
        </nav>

        <div id="mesa">
            <div class="hand grow">
                <div title="Click na carta vencedora"
                     @click="setarGanhador(index)"
                     class="card" v-for="(item, index) in mesa"
                     :key="index"
                     :class="classeCarta(index, item)">
                    <p>{{ extrairCarta(item.carta) }}</p>
                    <span>{{item.jogador}}</span>
                </div>
            </div>
        </div>

        <div v-if="estaLogado" id="minhas">
            <div class="hand grow">
                <div title="Click para jogar a carta"
                     class="card" v-for="(item, index) in cartas" :key="index" @click="jogar(index, item)"
                     :class="classeMinhaCarta(item)">
                    <p>{{ extrairCarta(item) }}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'App',
        data: function () {
            return {
                // host: 'https://baralho-game.herokuapp.com',
                //host: 'http://localhost:3000', // Para executar local use essa porta
                //host: '',
                host: process.env.VUE_APP_ROOT_API || '',
                nome: null,
                senha: null,
                admin: false,
                dealer: false,
                quantidade: 0,
                mesa: [],
                curingas: [],
                jogadores: [],
                cartas: [],
                jogando: false,
                setandoGanhador: false,
                virandoAdmin: false,
                largandoAdmin: false,
                removendoJogador: false,
            }
        },
        components: {},
        mounted: function () {
            if (window.localStorage) {
                if (window.localStorage.getItem('nome') && window.localStorage.getItem('senha')) {
                    this.nome = window.localStorage.getItem('nome')
                    this.senha = window.localStorage.getItem('senha')
                }
            }
            setInterval(() => {
                this.sala();
                this.getCartas();
            }, 1000);
        },
        computed: {
            estaLogado() {
                return (this.nome != null && this.senha != null)
            },
            existeAdmin() {
                let admin = this.jogadores.filter((j) => j.admin == true)
                return admin.length > 0
            },
            isAdmin() {
                return (this.admin === true)
            },
            isDealer() {
                return (this.dealer === true)
            },
            quemTemPoe() {
                if (this.mesa.length && this.curingas.length) {
                    return this.extrairNype(this.mesa[0].carta) === this.extrairNype(this.curingas[0])
                } else {
                    return false
                }
            }
        },
        methods: {
            minhaCartaECuringa(carta) {
                if (this.curingas.length) {
                    return this.extrairNype(carta) === this.extrairNype(this.curingas[0])
                } else {
                    return false
                }
            },
            extrairNype(carta) {
                if (carta) {
                    let nype = carta.substr(0, 1) == '1' ? carta.substr(2, 1) : carta.substr(1, 1);
                    switch (nype) {
                        case "♦":
                            return "suitdiamonds";
                        case "♥":
                            return "suithearts";
                        case "♣":
                            return "suitclubs";
                        case "♠":
                            return "suitspades";
                        default:
                            return "0"
                    }
                }
            },
            extrairBaralho(carta) {
                return carta.substr(0, 1) == '1' ? carta.substr(3, 1) : carta.substr(2, 1);
            },
            extrairCarta(carta) {
                return carta.substr(0, 1) == '1' ? carta.substr(0, 2) : carta.substr(0, 1);
            },
            entrar() {
                let nome = prompt('Seu nome ?')
                if (nome != undefined && nome != '') {
                    this.nome = nome
                    axios.post(this.host + "/salas/entrar",
                        {
                            "nome": this.nome
                        }
                    ).then((response) => {
                        this.senha = response.data.senha
                        window.localStorage.setItem('nome', this.nome)
                        window.localStorage.setItem('senha', this.senha)
                    });
                }
            },
            sair() {
                axios.post(this.host + "/salas/sair",
                    {
                        "nome": this.nome,
                        "senha": this.senha
                    }
                ).then(() => {
                    this.nome = null
                    this.senha = null
                    this.cartas = []
                    window.localStorage.removeItem('nome')
                    window.localStorage.removeItem('senha')
                }).catch((error) => {
                    let response = error.response;
                    if (response) {
                        if (response.status == 422) {
                            this.nome = null
                            this.senha = null
                            this.cartas = []
                            window.localStorage.removeItem('nome')
                            window.localStorage.removeItem('senha')
                        }
                    }
                });
            },
            embaralhar() {
                let pmt = prompt('Quantas cartas ?')
                const qtd = parseInt(pmt)
                if (pmt != undefined && !isNaN(qtd) && qtd > 0) {
                    axios.post(this.host + "/salas/embaralhar",
                        {
                            "quantidade": qtd,
                            "nome": this.nome,
                            "senha": this.senha
                        }
                    );
                }
            },
            possoJogar() {
                let maiorNumeroDeCartasDaMesa = this.jogadores.reduce((p, n) => p.quantidadeCartas > n.quantidadeCartas ? p.quantidadeCartas : n.quantidadeCartas)
                if (maiorNumeroDeCartasDaMesa.quantidadeCartas !== undefined) {
                    maiorNumeroDeCartasDaMesa = maiorNumeroDeCartasDaMesa.quantidadeCartas
                }
                //console.log("Can I play? " + this.mesa.length, this.jogadores.length, maiorNumeroDeCartasDaMesa)
                let firstCheck = this.cartas.length >= maiorNumeroDeCartasDaMesa && this.mesa.length < this.jogadores.length
                if (firstCheck) {
                    return this.jogadorAtual
                }
                return false;
            },
            tenhoCuringa() {
                if (this.curingas.length) {
                    let curingas = this.cartas.filter((c) => this.extrairNype(c) === this.extrairNype(this.curingas[0]))
                    return curingas.length > 0
                } else {
                    return false
                }
            },
            classeMinhaCarta (carta) {
                if (this.quemTemPoe && this.minhaCartaECuringa(carta) && this.possoJogar()) {
                    return 'quemTemPoe ' + this.extrairNype(carta)
                } else if (this.quemTemPoe && !this.minhaCartaECuringa(carta) && this.tenhoCuringa()) {
                    return 'cartaBloqueada ' + this.extrairNype(carta)
                } else if (this.quemTemPoe && !this.minhaCartaECuringa(carta) && !this.tenhoCuringa() && !this.possoJogar()) {
                    return 'cartaBloqueada ' + this.extrairNype(carta)
                } else if (this.quemTemPoe && this.minhaCartaECuringa(carta) && this.tenhoCuringa() && !this.possoJogar()) {
                    return 'cartaBloqueada ' + this.extrairNype(carta)
                } else if (!this.quemTemPoe && !this.possoJogar()) {
                    return 'cartaBloqueada ' + this.extrairNype(carta)
                } else {
                  return this.extrairNype(carta)
                }
            },
            classeCarta (index, item) {
                if (this.extrairNype(item.carta) === this.extrairNype(this.curingas[0]) && this.extrairCarta(item.carta) === this.extrairCarta(this.curingas[0])) {
                    return 'quemTemPoeMaster ' + this.extrairNype(item.carta)
                } else if (this.extrairNype(item.carta) === this.extrairNype(this.curingas[0])) {
                    return 'quemTemPoe ' + this.extrairNype(item.carta)
                } else {
                    return this.extrairNype(item.carta)
                }
            },
            cartaPermitida(carta) {
                return (
                    (this.quemTemPoe && this.minhaCartaECuringa(carta) && this.possoJogar()) ||
                    (this.quemTemPoe && !this.minhaCartaECuringa(carta) && !this.tenhoCuringa() && this.possoJogar()) ||
                    !this.quemTemPoe && this.possoJogar()
                )
            },
            jogar(index, carta) {
                if (this.jogando !== true) {
                  if (this.cartaPermitida(carta)) {
                    this.jogando = true
                    axios.post(this.host + "/salas/jogar",
                        {
                          "posicaoCarta": index,
                          "nome": this.nome,
                          "senha": this.senha,
                        }
                    ).then((response) => {
                      this.sala()
                      this.cartas = response.data.cartas
                      this.jogando = false
                    });
                  }
                }
            },
            setarGanhador(index) {
              if (this.setandoGanhador !== true) {
                if (this.admin) {
                  this.setandoGanhador = true
                  axios.post(this.host + "/salas/setarGanhador",
                      {
                        "nome": this.nome,
                        "senha": this.senha,
                        "posicaoCartaVencedora": index
                      }
                  ).then(() => {
                    this.sala()
                    this.setandoGanhador = false
                  });
                }
              }
            },
            virarAdmin() {
                if (this.virandoAdmin !== true) {
                  this.virandoAdmin = true
                  axios.post(this.host + "/salas/virarAdmin",
                      {
                        "nome": this.nome,
                        "senha": this.senha,
                      }
                  ).then(() => {
                    this.sala()
                    this.virandoAdmin = false
                  });
                }
            },
            largarAdmin() {
                if (this.largandoAdmin !== true) {
                  this.largandoAdmin = true
                  axios.post(this.host + "/salas/largarAdmin",
                      {
                        "nome": this.nome,
                        "senha": this.senha,
                      }
                  ).then(() => {
                    this.sala()
                    this.largandoAdmin = false
                  });
                }
            },
            sala() {
                axios.get(this.host + "/salas")
                    .then((response) => {
                        if (response.data && response.data.mesa) {
                            if (this.mesa.length !== response.data.mesa.length) {
                                this.mesa = response.data.mesa;
                            }
                            this.jogadores = response.data.jogadores;
                            this.curingas = response.data.curingas
                        }
                    })
            },
            novaRodada() {
                axios.post(this.host + "/salas/novaRodada")
            },
            removerJogador(index) {
              if (this.removendoJogador !== true) {
                if (this.admin) {
                  this.removendoJogador = true
                  axios.post(this.host + "/salas/removerJogador",
                      {
                        "nome": this.nome,
                        "senha": this.senha,
                        "posicaoJogadorRemovido": index
                      }
                  ).then(() => {
                    this.sala()
                    this.removendoJogador = false
                  });
                }
              }
            },
            getCartas() {
                if (this.nome != null && this.senha != null) {
                    axios.post(this.host + "/salas/minhasCartas",
                        {
                            "nome": this.nome,
                            "senha": this.senha
                        })
                        .then((response) => {
                            if (response.data) {
                                this.cartas = response.data.cartas
                                this.dealer = response.data.dealer
                                this.admin = response.data.admin
                                this.jogadorAtual = response.data.jogadorAtual
                                if (response.data.perguntarPrevisao && this.informandoPrevisao !== true) {
                                    setTimeout(() => this.informarPrevisao(parseInt(response.data.restricaoPrevisao)), 200);
                                }
                            } else {
                                this.sair();
                            }
                        })
                        .catch((error) => {
                            let response = error.response;
                            if (response) {
                                let businessError = response.data.businessError;
                                if (response.status == 422 && businessError) {
                                    if (businessError.type == 'RoomIsEmptyError') {
                                        this.sair();
                                    }
                                }
                            }
                        })
                }
            },
            informarPrevisao(restricaoPrevisao) {
              if (this.informandoPrevisao !== true) {
                this.informandoPrevisao = true;
                const possuiRestricao = !isNaN(restricaoPrevisao);
                const strRestricao = possuiRestricao ? "(não pode ser " + restricaoPrevisao + ") " : "";
                let precisaPrevisao = true;
                while(precisaPrevisao) {
                    let pmt = prompt("Informe sua previsão: " + strRestricao);
                    const qtd = parseInt(pmt)
                    if (pmt != undefined && !isNaN(qtd) && qtd >= 0) {
                        if (qtd !== restricaoPrevisao) {
                            precisaPrevisao = false;
                            axios.post(this.host + "/salas/previsao",
                                {
                                    "nome": this.nome,
                                    "senha": this.senha,
                                    "quantidade": qtd
                                })
                                .then((response) => {
                                    this.cartas = response.data.cartas
                                    this.dealer = response.data.dealer
                                    this.admin = response.data.admin
                                    this.jogadorAtual = response.data.jogadorAtual
                                    this.informandoPrevisao = false;                       
                                });
                        }
                    }
                }
              }
            }
        }
    }
</script>

<style>
    @media only screen and (max-width: 1200px) {
        body {
           zoom: 50%;
        }
    }

    #app {
        margin-top: 100px;
    }
    #curinga {
        color: #000;
    }
    #curinga .card{
        zoom: 50%;
    }

    #navbar-example {
        z-index: 999;
        background-color: #005f2f !important;
        color: #FFF !important;
        position: fixed;
        width: 100%;
        top: 0;
    }
    #mesa{
        padding-top: 1px;
    }

    #mesa .card {
        text-align: center;
    }

    .cartaBloqueada {
        opacity: .5;
        cursor: not-allowed !important;
    }

    .quemTemPoe {
        -webkit-animation: quemTemPoe 1s ease-in-out infinite alternate;
        -moz-animation: quemTemPoe 1s ease-in-out infinite alternate;
        animation: quemTemPoe 1s ease-in-out infinite alternate;
    }

    @-webkit-keyframes quemTemPoe {
        from {
            box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e60073, 0 0 20px #e60073, 0 0 25px #e60073, 0 0 30px #e60073, 0 0 35px #e60073;
        }
        to {
            box-shadow: 0 0 10px #fff, 0 0 15px #ff4da6, 0 0 20px #ff4da6, 0 0 25px #ff4da6, 0 0 30px #ff4da6, 0 0 70px #ff4da6, 0 0 40px #ff4da6;
        }
    }

    .quemTemPoeMaster {
        -webkit-animation: quemTemPoeMaster 1s ease-in-out infinite alternate;
        -moz-animation: quemTemPoeMaster 1s ease-in-out infinite alternate;
        animation: quemTemPoeMaster 1s ease-in-out infinite alternate;
    }

    @-webkit-keyframes quemTemPoeMaster {
        from {
            box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e6950c, 0 0 20px #e6950c, 0 0 25px #e6950c, 0 0 30px #e6950c, 0 0 35px #e6950c;
        }
        to {
            box-shadow: 0 0 10px #fff, 0 0 15px #ffd07d, 0 0 20px #ffd07d, 0 0 25px #ffd07d, 0 0 30px #ffd07d, 0 0 70px #ffd07d, 0 0 40px #ffd07d;
        }
    }

    #mesa span {
        color: #FFF;
    }

    #minhas {
        background-color: #0e7d45;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
    }

    #minhas .card {
        display:inline-block;
        float: initial;
    }
    .nav-item {
        margin-left: 10px;
    }
    .jogador {
        text-align: center;
        position: relative;
        float: left;
        margin: 0 30px;
    }
    .jogador .admin {
        border: 1px solid #00a651;
        background-color: #28a745;
        border-radius: 7px;
        padding: 0 5px;
        margin-top: 4px;
        font-size: 10pt;
    }
    .jogador .foto img {
        width: 60px;
        height: 60px;
        border-radius: 50%
    }
    .jogador p {
        padding: 0;
        margin: 0;
    }
    .jogador .nome {
        display: block;
    }
    .jogador .qtdCartas{
        position: absolute;
        top: 0;
        left: -12px;
        display: none;
    }
    .jogador .qtdPontos{
        position: absolute;
        top: 0;
        right: -30px;
        font-size: 100%;
    }
    .jogador .previsao{
        position: absolute;
        top: 0;
        left: -12px;
        font-size: 100%;
    }
    .jogador .totalPontos{
        position: absolute;
        top: 30px;
        right: -30px;
        font-size: 100%;
    }

    .dealer {
        border: 4px solid #ffffff70;
        background-color: #ffffff70;
        border-radius: 15px;
        padding: 0 5px;
    }

    .admin {

    }

    .removerJogador {
      /*position: absolute;*/
      /*bottom: 0;*/
      /*right: -23px;*/
      font-size: 80%;
      padding: 0 5px;
      cursor: pointer;
      border: 1px solid #ef9696;
      border-radius: 15px;
      background-color: #eba7a7;
    }

    .cor-1 {
        background-color: darkmagenta;
    }
    .cor-2 {
        background-color: darkolivegreen;
    }
    .cor-3 {
        background-color: darkslateblue;
    }
    .cor-4 {
        background-color: darkslategray;
    }
    .cor-5 {
        background-color: darkorchid;
    }
    .cor-6 {
        background-color: darkgreen;
    }
    .cor-7 {
        background-color: darkgoldenrod;
    }
    .cor-8 {
        background-color: darkblue;
    }
    .cor-9 {
        background-color: darkcyan;
    }
    .cor-10 {
        background-color: darkred;
    }
</style>
