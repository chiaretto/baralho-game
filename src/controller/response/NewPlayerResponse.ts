import { Player } from '../../domain/Player';

export class NewPlayerResponse {
  nome: string;
  senha: string;
  constructor(jogador: Player, passwd: string) {
    this.nome = jogador.name;
    this.senha = passwd;
  }
}
