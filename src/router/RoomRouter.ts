import { Router } from 'express';
import { gameController } from '../controller/GameController';
import { roomController } from '../controller/RoomController';
import { roomPlayerController } from '../controller/RoomPlayerController';
import { Deck } from '../domain/Deck';

const roomRouter: Router = Router();

//Routes
roomRouter.get('/deck', roomController.home);
roomRouter.get('/', roomController.showRoom);
roomRouter.post('/embaralhar', roomController.scramble);
roomRouter.post('/setarGanhador', roomController.setCurrentWinner);

roomRouter.get('/pontuacao', roomController.fullScore);
roomRouter.post('/novaRodada', roomController.newRound);
roomRouter.get('/reiniciar', roomController.reboot);

roomRouter.post('/entrar', roomPlayerController.join);
roomRouter.post('/sair', roomPlayerController.leave);
roomRouter.post('/minhasCartas', roomPlayerController.viewOwnCards);

roomRouter.post('/jogar', gameController.play);
roomRouter.post('/previsao', gameController.setForecast);

roomRouter.post('/virarAdmin', roomPlayerController.turnOnAdmin);
roomRouter.post('/largarAdmin', roomPlayerController.turnOffAdmin);
roomRouter.post('/removerJogador', roomPlayerController.removePlayerByPosition);

console.log('Baralho iniciado: ' + Deck.allCards.length);

export { roomRouter };
