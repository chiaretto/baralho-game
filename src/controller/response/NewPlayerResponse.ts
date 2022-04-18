import { Player } from '../../domain/Player';

export class NewPlayerResponse {
  nome: string;
  senha: string;
  constructor(jogador: Player, senha: string) {
    this.nome = jogador.name;
    this.senha = senha;
  }
}
