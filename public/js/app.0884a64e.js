(function(t){function a(a){for(var n,i,o=a[0],u=a[1],c=a[2],l=0,d=[];l<o.length;l++)i=o[l],Object.prototype.hasOwnProperty.call(s,i)&&s[i]&&d.push(s[i][0]),s[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);h&&h(a);while(d.length)d.shift()();return r.push.apply(r,c||[]),e()}function e(){for(var t,a=0;a<r.length;a++){for(var e=r[a],n=!0,o=1;o<e.length;o++){var u=e[o];0!==s[u]&&(n=!1)}n&&(r.splice(a--,1),t=i(i.s=e[0]))}return t}var n={},s={app:0},r=[];function i(a){if(n[a])return n[a].exports;var e=n[a]={i:a,l:!1,exports:{}};return t[a].call(e.exports,e,e.exports,i),e.l=!0,e.exports}i.m=t,i.c=n,i.d=function(t,a,e){i.o(t,a)||Object.defineProperty(t,a,{enumerable:!0,get:e})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,a){if(1&a&&(t=i(t)),8&a)return t;if(4&a&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(i.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&a&&"string"!=typeof t)for(var n in t)i.d(e,n,function(a){return t[a]}.bind(null,n));return e},i.n=function(t){var a=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(a,"a",a),a},i.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},i.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=a,o=o.slice();for(var c=0;c<o.length;c++)a(o[c]);var h=u;r.push([0,"chunk-vendors"]),e()})({0:function(t,a,e){t.exports=e("56d7")},"034f":function(t,a,e){"use strict";var n=e("85ec"),s=e.n(n);s.a},"56d7":function(t,a,e){"use strict";e.r(a);e("e260"),e("e6cf"),e("cca6"),e("a79d");var n=e("2b0e"),s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"app"}},[e("nav",{staticClass:"navbar navbar-light bg-light",attrs:{id:"navbar-example"}},[e("span",{attrs:{id:"curinga"}},t._l(t.curingas,(function(a){return e("div",{key:a,staticClass:"card",class:t.quemTemPoe?"quemTemPoe "+t.extrairNype(a):t.extrairNype(a)},[e("p",[t._v(t._s(t.extrairCarta(a)))])])})),0),e("span",{attrs:{id:"jogadores"}},t._l(t.jogadores,(function(a){return e("div",{key:a.nome,staticClass:"jogador",class:a.dealer?"dealer":"",attrs:{title:a.admin?"Admin":""}},[e("span",{staticClass:"foto"},[e("img",{attrs:{src:"https://api.adorable.io/avatars/60/"+a.nome+".png",alt:""}})]),e("span",{staticClass:"nome",class:a.admin?"admin":""},[t._v(t._s(a.nome))]),e("span",{staticClass:"qtdCartas badge",class:"cor-"+a.quantidadeCartas,attrs:{title:"Quantidade cartas"}},[t._v(t._s(a.quantidadeCartas))]),e("span",{staticClass:"qtdPontos badge badge-dark",attrs:{title:"Vitorias"}},[t._v(t._s(a.pontosRodada))])])})),0),e("ul",{staticClass:"nav nav-pills"},[e("li",{staticClass:"nav-item"},[t.estaLogado?e("input",{staticClass:"btn btn-sm btn-success",attrs:{type:"button",value:"Dar Cartas"},on:{click:function(a){return t.embaralhar()}}}):t._e()]),e("li",{staticClass:"nav-item"},[t.estaLogado&&!t.existeAdmin?e("input",{staticClass:"btn btn-sm btn-warning",attrs:{type:"button",value:"Virar Admin"},on:{click:function(a){return t.virarAdmin()}}}):t._e()]),e("li",{staticClass:"nav-item"},[t.estaLogado?t._e():e("button",{staticClass:"btn btn-sm btn-primary",attrs:{type:"button"},on:{click:function(a){return t.entrar()}}},[t._v("Entrar")]),t.estaLogado?e("input",{staticClass:"btn btn-sm btn-danger",attrs:{type:"button",value:"Sair"},on:{click:function(a){return t.sair()}}}):t._e()])])]),e("div",{attrs:{id:"mesa"}},[e("div",{staticClass:"hand grow"},t._l(t.mesa,(function(a,n){return e("div",{key:n,staticClass:"card",class:0===n&&t.quemTemPoe?"quemTemPoe "+t.extrairNype(a.carta):t.extrairNype(a.carta),attrs:{title:"Click na carta vencedora"},on:{click:function(a){return t.setarGanhador(n)}}},[e("p",[t._v(t._s(t.extrairCarta(a.carta)))]),e("span",[t._v(t._s(a.jogador))])])})),0)]),t.estaLogado?e("div",{attrs:{id:"minhas"}},[e("div",{staticClass:"hand grow"},t._l(t.cartas,(function(a,n){return e("div",{key:n,staticClass:"card",class:t.classeMinhaCarta(a),attrs:{title:"Click para jogar a carta"},on:{click:function(e){return t.jogar(n,a)}}},[e("p",[t._v(t._s(t.extrairCarta(a)))])])})),0)]):t._e()])},r=[],i=(e("4de4"),e("13d5"),e("bc3a")),o=e.n(i),u={name:"App",data:function(){return{host:"",nome:null,senha:null,admin:!1,dealer:!1,quantidade:0,mesa:[],curingas:[],jogadores:[],cartas:[]}},components:{},mounted:function(){var t=this;window.localStorage&&window.localStorage.getItem("nome")&&window.localStorage.getItem("senha")&&(this.nome=window.localStorage.getItem("nome"),this.senha=window.localStorage.getItem("senha")),setInterval((function(){t.sala(),t.getCartas()}),1e3)},computed:{estaLogado:function(){return null!=this.nome&&null!=this.senha},existeAdmin:function(){var t=this.jogadores.filter((function(t){return 1==t.admin}));return t.length>0},isAdmin:function(){return!0===this.admin},isDealer:function(){return!0===this.dealer},quemTemPoe:function(){return!(!this.mesa.length||!this.curingas.length)&&this.extrairNype(this.mesa[0].carta)===this.extrairNype(this.curingas[0])}},methods:{minhaCartaECuringa:function(t){return!!this.curingas.length&&this.extrairNype(t)===this.extrairNype(this.curingas[0])},extrairNype:function(t){if(t){var a="1"==t.substr(0,1)?t.substr(2,1):t.substr(1,1);switch(a){case"♦":return"suitdiamonds";case"♥":return"suithearts";case"♣":return"suitclubs";case"♠":return"suitspades";default:return"0"}}},extrairBaralho:function(t){return"1"==t.substr(0,1)?t.substr(3,1):t.substr(2,1)},extrairCarta:function(t){return"1"==t.substr(0,1)?t.substr(0,2):t.substr(0,1)},entrar:function(){var t=this,a=prompt("Seu nome ?");void 0!=a&&""!=a&&(this.nome=a,o.a.post(this.host+"/salas/entrar",{nome:this.nome}).then((function(a){t.senha=a.data.senha,window.localStorage.setItem("nome",t.nome),window.localStorage.setItem("senha",t.senha)})))},sair:function(){var t=this;o.a.post(this.host+"/salas/sair",{nome:this.nome,senha:this.senha}).then((function(){t.nome=null,t.senha=null,t.cartas=[],window.localStorage.removeItem("nome"),window.localStorage.removeItem("senha")}))},embaralhar:function(){var t=prompt("Quantas cartas ?");void 0!=t&&""!=t&&o.a.post(this.host+"/salas/embaralhar",{quantidade:t,nome:this.nome,senha:this.senha})},possoJogar:function(){var t=this.jogadores.reduce((function(t,a){return t.quantidadeCartas>a.quantidadeCartas?t.quantidadeCartas:a.quantidadeCartas}));return console.log(this.mesa.length,this.jogadores.length,t.quantidadeCartas),this.cartas.length>=t.quantidadeCartas&&this.mesa.length<this.jogadores.length},tenhoCuringa:function(){var t=this;if(this.curingas.length){var a=this.cartas.filter((function(a){return t.extrairNype(a)===t.extrairNype(t.curingas[0])}));return a.length>0}return!1},classeMinhaCarta:function(t){return this.quemTemPoe&&this.minhaCartaECuringa(t)&&this.possoJogar()?"quemTemPoe "+this.extrairNype(t):this.quemTemPoe&&!this.minhaCartaECuringa(t)&&this.tenhoCuringa()?"cartaBloqueada "+this.extrairNype(t):!this.quemTemPoe||this.minhaCartaECuringa(t)||this.tenhoCuringa()||this.possoJogar()?this.quemTemPoe&&this.minhaCartaECuringa(t)&&this.tenhoCuringa()&&!this.possoJogar()?"cartaBloqueada "+this.extrairNype(t):this.quemTemPoe||this.possoJogar()?this.extrairNype(t):"cartaBloqueada "+this.extrairNype(t):"cartaBloqueada "+this.extrairNype(t)},cartaPermitida:function(t){return this.quemTemPoe&&this.minhaCartaECuringa(t)&&this.possoJogar()||this.quemTemPoe&&!this.minhaCartaECuringa(t)&&!this.tenhoCuringa()&&this.possoJogar()||!this.quemTemPoe&&this.possoJogar()},jogar:function(t,a){var e=this;this.cartaPermitida(a)&&o.a.post(this.host+"/salas/jogar",{posicaoCarta:t,nome:this.nome,senha:this.senha}).then((function(t){e.sala(),e.cartas=t.data.cartas}))},setarGanhador:function(t){var a=this;this.admin&&o.a.post(this.host+"/salas/setarGanhador",{posicaoCartaVencedora:t}).then((function(){a.sala()}))},virarAdmin:function(){var t=this;o.a.post(this.host+"/salas/virarAdmin",{nome:this.nome,senha:this.senha}).then((function(){t.sala()}))},sala:function(){var t=this;o.a.get(this.host+"/salas").then((function(a){a.data&&a.data.mesa&&(t.mesa.length!==a.data.mesa.length&&(t.mesa=a.data.mesa),t.jogadores=a.data.jogadores,t.curingas=a.data.curingas)}))},novaRodada:function(){o.a.post(this.host+"/salas/novaRodada")},getCartas:function(){var t=this;null!=this.nome&&null!=this.senha&&o.a.post(this.host+"/salas/minhasCartas",{nome:this.nome,senha:this.senha}).then((function(a){t.cartas=a.data.cartas,t.dealer=a.data.dealer,t.admin=a.data.admin}))}}},c=u,h=(e("034f"),e("2877")),l=Object(h["a"])(c,s,r,!1,null,null,null),d=l.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(d)}}).$mount("#app")},"85ec":function(t,a,e){}});
//# sourceMappingURL=app.0884a64e.js.map