(function(a){function t(t){for(var n,i,o=t[0],u=t[1],d=t[2],c=0,l=[];c<o.length;c++)i=o[c],Object.prototype.hasOwnProperty.call(e,i)&&e[i]&&l.push(e[i][0]),e[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(a[n]=u[n]);h&&h(t);while(l.length)l.shift()();return r.push.apply(r,d||[]),s()}function s(){for(var a,t=0;t<r.length;t++){for(var s=r[t],n=!0,o=1;o<s.length;o++){var u=s[o];0!==e[u]&&(n=!1)}n&&(r.splice(t--,1),a=i(i.s=s[0]))}return a}var n={},e={app:0},r=[];function i(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return a[t].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=a,i.c=n,i.d=function(a,t,s){i.o(a,t)||Object.defineProperty(a,t,{enumerable:!0,get:s})},i.r=function(a){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})},i.t=function(a,t){if(1&t&&(a=i(a)),8&t)return a;if(4&t&&"object"===typeof a&&a&&a.__esModule)return a;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:a}),2&t&&"string"!=typeof a)for(var n in a)i.d(s,n,function(t){return a[t]}.bind(null,n));return s},i.n=function(a){var t=a&&a.__esModule?function(){return a["default"]}:function(){return a};return i.d(t,"a",t),t},i.o=function(a,t){return Object.prototype.hasOwnProperty.call(a,t)},i.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=t,o=o.slice();for(var d=0;d<o.length;d++)t(o[d]);var h=u;r.push([0,"chunk-vendors"]),s()})({0:function(a,t,s){a.exports=s("56d7")},"034f":function(a,t,s){"use strict";var n=s("85ec"),e=s.n(n);e.a},"56d7":function(a,t,s){"use strict";s.r(t);s("e260"),s("e6cf"),s("cca6"),s("a79d");var n=s("2b0e"),e=function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("div",{attrs:{id:"app"}},[s("nav",{staticClass:"navbar navbar-light bg-light",attrs:{id:"navbar-example"}},[s("span",{attrs:{id:"curinga"}},a._l(a.curingas,(function(t){return s("div",{key:t,staticClass:"card",class:a.quemTemPoe?"quemTemPoe "+a.extrairNype(t):a.extrairNype(t)},[s("p",[a._v(a._s(a.extrairCarta(t)))])])})),0),s("span",{attrs:{id:"jogadores"}},a._l(a.jogadores,(function(t,n){return s("div",{key:t.nome,staticClass:"jogador",class:t.dealer?"dealer":"",attrs:{title:t.admin?"Admin":""}},[s("span",{staticClass:"foto"},[s("img",{attrs:{src:"https://avatars.dicebear.com/api/bottts/"+t.nome+".png",alt:""}})]),s("span",{staticClass:"nome",class:t.admin?"admin":""},[a._v(a._s(t.nome))]),s("span",{staticClass:"qtdCartas badge",class:"cor-"+t.quantidadeCartas,attrs:{title:"Quantidade cartas"}},[a._v(a._s(t.quantidadeCartas))]),s("span",{staticClass:"qtdPontos badge badge-dark",attrs:{title:"Vitorias"}},[a._v(a._s(t.pontosRodada))]),s("span",{staticClass:"previsao badge badge-light",attrs:{title:"Previsao"}},[a._v(a._s(t.previsaoRodada))]),s("span",{staticClass:"totalPontos badge badge-dark",attrs:{title:"Total"}},[a._v(a._s(t.pontosTotal))]),a.isAdmin&&!t.admin?s("span",{staticClass:"removerJogador",on:{click:function(t){return a.removerJogador(n)}}},[a._v("Remover")]):a._e()])})),0),s("ul",{staticClass:"nav nav-pills"},[s("li",{staticClass:"nav-item"},[a.estaLogado?s("input",{staticClass:"btn btn-sm btn-success",attrs:{type:"button",value:"Dar Cartas"},on:{click:function(t){return a.embaralhar()}}}):a._e()]),s("li",{staticClass:"nav-item"},[a.estaLogado&&!a.existeAdmin?s("input",{staticClass:"btn btn-sm btn-warning",attrs:{type:"button",value:"Virar Admin"},on:{click:function(t){return a.virarAdmin()}}}):a._e(),a.estaLogado&&a.existeAdmin&&this.isAdmin?s("input",{staticClass:"btn btn-sm btn-warning",attrs:{type:"button",value:"Largar Admin"},on:{click:function(t){return a.largarAdmin()}}}):a._e()]),s("li",{staticClass:"nav-item"},[a.estaLogado?a._e():s("button",{staticClass:"btn btn-sm btn-primary",attrs:{type:"button"},on:{click:function(t){return a.entrar()}}},[a._v("Entrar")]),a.estaLogado?s("input",{staticClass:"btn btn-sm btn-danger",attrs:{type:"button",value:"Sair"},on:{click:function(t){return a.sair()}}}):a._e()])])]),s("div",{attrs:{id:"mesa"}},[s("div",{staticClass:"hand grow"},a._l(a.mesa,(function(t,n){return s("div",{key:n,staticClass:"card",class:a.classeCarta(n,t),attrs:{title:"Click na carta vencedora"},on:{click:function(t){return a.setarGanhador(n)}}},[s("p",[a._v(a._s(a.extrairCarta(t.carta)))]),s("span",[a._v(a._s(t.jogador))])])})),0)]),a.estaLogado?s("div",{attrs:{id:"minhas"}},[s("div",{staticClass:"hand grow"},a._l(a.cartas,(function(t,n){return s("div",{key:n,staticClass:"card",class:a.classeMinhaCarta(t),attrs:{title:"Click para jogar a carta"},on:{click:function(s){return a.jogar(n,t)}}},[s("p",[a._v(a._s(a.extrairCarta(t)))])])})),0)]):a._e()])},r=[],i=(s("4de4"),s("13d5"),s("bc3a")),o=s.n(i),u={name:"App",data:function(){return{host:Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_ROOT_API||"",nome:null,senha:null,admin:!1,dealer:!1,quantidade:0,mesa:[],curingas:[],jogadores:[],cartas:[],jogando:!1,setandoGanhador:!1,virandoAdmin:!1,largandoAdmin:!1,removendoJogador:!1}},components:{},mounted:function(){var a=this;window.localStorage&&window.localStorage.getItem("nome")&&window.localStorage.getItem("senha")&&(this.nome=window.localStorage.getItem("nome"),this.senha=window.localStorage.getItem("senha")),setInterval((function(){a.sala(),a.getCartas()}),1e3)},computed:{estaLogado:function(){return null!=this.nome&&null!=this.senha},existeAdmin:function(){var a=this.jogadores.filter((function(a){return 1==a.admin}));return a.length>0},isAdmin:function(){return!0===this.admin},isDealer:function(){return!0===this.dealer},quemTemPoe:function(){return!(!this.mesa.length||!this.curingas.length)&&this.extrairNype(this.mesa[0].carta)===this.extrairNype(this.curingas[0])}},methods:{minhaCartaECuringa:function(a){return!!this.curingas.length&&this.extrairNype(a)===this.extrairNype(this.curingas[0])},extrairNype:function(a){if(a){var t="1"==a.substr(0,1)?a.substr(2,1):a.substr(1,1);switch(t){case"♦":return"suitdiamonds";case"♥":return"suithearts";case"♣":return"suitclubs";case"♠":return"suitspades";default:return"0"}}},extrairBaralho:function(a){return"1"==a.substr(0,1)?a.substr(3,1):a.substr(2,1)},extrairCarta:function(a){return"1"==a.substr(0,1)?a.substr(0,2):a.substr(0,1)},entrar:function(){var a=this,t=prompt("Seu nome ?");void 0!=t&&""!=t&&(this.nome=t,o.a.post(this.host+"/salas/entrar",{nome:this.nome}).then((function(t){a.senha=t.data.senha,window.localStorage.setItem("nome",a.nome),window.localStorage.setItem("senha",a.senha)})))},sair:function(){var a=this;o.a.post(this.host+"/salas/sair",{nome:this.nome,senha:this.senha}).then((function(){a.nome=null,a.senha=null,a.cartas=[],window.localStorage.removeItem("nome"),window.localStorage.removeItem("senha")})).catch((function(t){var s=t.response;s&&422==s.status&&(a.nome=null,a.senha=null,a.cartas=[],window.localStorage.removeItem("nome"),window.localStorage.removeItem("senha"))}))},embaralhar:function(){var a=prompt("Quantas cartas ?"),t=parseInt(a);void 0!=a&&!isNaN(t)&&t>0&&o.a.post(this.host+"/salas/embaralhar",{quantidade:t,nome:this.nome,senha:this.senha})},possoJogar:function(){var a=this.jogadores.reduce((function(a,t){return a.quantidadeCartas>t.quantidadeCartas?a.quantidadeCartas:t.quantidadeCartas}));void 0!==a.quantidadeCartas&&(a=a.quantidadeCartas);var t=this.cartas.length>=a&&this.mesa.length<this.jogadores.length;return!!t&&this.jogadorAtual},tenhoCuringa:function(){var a=this;if(this.curingas.length){var t=this.cartas.filter((function(t){return a.extrairNype(t)===a.extrairNype(a.curingas[0])}));return t.length>0}return!1},classeMinhaCarta:function(a){return this.quemTemPoe&&this.minhaCartaECuringa(a)&&this.possoJogar()?"quemTemPoe "+this.extrairNype(a):this.quemTemPoe&&!this.minhaCartaECuringa(a)&&this.tenhoCuringa()?"cartaBloqueada "+this.extrairNype(a):!this.quemTemPoe||this.minhaCartaECuringa(a)||this.tenhoCuringa()||this.possoJogar()?this.quemTemPoe&&this.minhaCartaECuringa(a)&&this.tenhoCuringa()&&!this.possoJogar()?"cartaBloqueada "+this.extrairNype(a):this.quemTemPoe||this.possoJogar()?this.extrairNype(a):"cartaBloqueada "+this.extrairNype(a):"cartaBloqueada "+this.extrairNype(a)},classeCarta:function(a,t){return this.extrairNype(t.carta)===this.extrairNype(this.curingas[0])&&this.extrairCarta(t.carta)===this.extrairCarta(this.curingas[0])?"quemTemPoeMaster "+this.extrairNype(t.carta):this.extrairNype(t.carta)===this.extrairNype(this.curingas[0])?"quemTemPoe "+this.extrairNype(t.carta):this.extrairNype(t.carta)},cartaPermitida:function(a){return this.quemTemPoe&&this.minhaCartaECuringa(a)&&this.possoJogar()||this.quemTemPoe&&!this.minhaCartaECuringa(a)&&!this.tenhoCuringa()&&this.possoJogar()||!this.quemTemPoe&&this.possoJogar()},jogar:function(a,t){var s=this;!0!==this.jogando&&this.cartaPermitida(t)&&(this.jogando=!0,o.a.post(this.host+"/salas/jogar",{posicaoCarta:a,nome:this.nome,senha:this.senha}).then((function(a){s.sala(),s.cartas=a.data.cartas,s.jogando=!1})))},setarGanhador:function(a){var t=this;!0!==this.setandoGanhador&&this.admin&&(this.setandoGanhador=!0,o.a.post(this.host+"/salas/setarGanhador",{nome:this.nome,senha:this.senha,posicaoCartaVencedora:a}).then((function(){t.sala(),t.setandoGanhador=!1})))},virarAdmin:function(){var a=this;!0!==this.virandoAdmin&&(this.virandoAdmin=!0,o.a.post(this.host+"/salas/virarAdmin",{nome:this.nome,senha:this.senha}).then((function(){a.sala(),a.virandoAdmin=!1})))},largarAdmin:function(){var a=this;!0!==this.largandoAdmin&&(this.largandoAdmin=!0,o.a.post(this.host+"/salas/largarAdmin",{nome:this.nome,senha:this.senha}).then((function(){a.sala(),a.largandoAdmin=!1})))},sala:function(){var a=this;o.a.get(this.host+"/salas").then((function(t){t.data&&t.data.mesa&&(a.mesa.length!==t.data.mesa.length&&(a.mesa=t.data.mesa),a.jogadores=t.data.jogadores,a.curingas=t.data.curingas)}))},novaRodada:function(){o.a.post(this.host+"/salas/novaRodada")},removerJogador:function(a){var t=this;!0!==this.removendoJogador&&this.admin&&(this.removendoJogador=!0,o.a.post(this.host+"/salas/removerJogador",{nome:this.nome,senha:this.senha,posicaoJogadorRemovido:a}).then((function(){t.sala(),t.removendoJogador=!1})))},getCartas:function(){var a=this;null!=this.nome&&null!=this.senha&&o.a.post(this.host+"/salas/minhasCartas",{nome:this.nome,senha:this.senha}).then((function(t){t.data?(a.cartas=t.data.cartas,a.dealer=t.data.dealer,a.admin=t.data.admin,a.jogadorAtual=t.data.jogadorAtual,t.data.perguntarPrevisao&&!0!==a.informandoPrevisao&&setTimeout((function(){return a.informarPrevisao(parseInt(t.data.restricaoPrevisao))}),200)):a.sair()})).catch((function(t){var s=t.response;if(s){var n=s.data.businessError;422==s.status&&n&&"RoomIsEmptyError"==n.type&&a.sair()}}))},informarPrevisao:function(a){var t=this;if(!0!==this.informandoPrevisao){this.informandoPrevisao=!0;var s=!isNaN(a),n=s?"(não pode ser "+a+") ":"",e=!0;while(e){var r=prompt("Informe sua previsão: "+n),i=parseInt(r);void 0!=r&&!isNaN(i)&&i>=0&&i!==a&&(e=!1,o.a.post(this.host+"/salas/previsao",{nome:this.nome,senha:this.senha,quantidade:i}).then((function(a){t.cartas=a.data.cartas,t.dealer=a.data.dealer,t.admin=a.data.admin,t.jogadorAtual=a.data.jogadorAtual,t.informandoPrevisao=!1})))}}}}},d=u,h=(s("034f"),s("2877")),c=Object(h["a"])(d,e,r,!1,null,null,null),l=c.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(a){return a(l)}}).$mount("#app")},"85ec":function(a,t,s){}});
//# sourceMappingURL=app.979c9733.js.map