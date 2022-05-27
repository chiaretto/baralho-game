import { Router } from 'express';
import { gameController } from '../controller/GameController';
import { roomAdminController } from '../controller/RoomAdminController';
import { roomController } from '../controller/RoomController';
import { roomPlayerController } from '../controller/RoomPlayerController';
import { Deck } from '../domain/Deck';

const roomRouter: Router = Router();

//Routes
roomRouter.get('/deck', roomController.home);
roomRouter.get('/', roomController.showRoom);
roomRouter.post('/', roomController.showRoom);

roomRouter.get('/pontuacao', roomController.fullScore);
roomRouter.get('/reiniciar', roomController.reboot);

roomRouter.post('/entrar', roomPlayerController.join);
roomRouter.post('/sair', roomPlayerController.leave);
roomRouter.post('/minhasCartas', roomPlayerController.viewOwnCards);

roomRouter.post('/jogar', gameController.play);
roomRouter.post('/previsao', gameController.setForecast);
roomRouter.post('/embaralhar', gameController.scramble);
roomRouter.post('/setarGanhador', gameController.finishRound);

roomRouter.post('/virarAdmin', roomAdminController.turnOnAdmin);
roomRouter.post('/largarAdmin', roomAdminController.turnOffAdmin);
roomRouter.post('/removerJogador', roomAdminController.removePlayerByPosition);

console.log('Baralho iniciado: ' + Deck.allCards.length);

export { roomRouter };
