import { AuthenticatedRequest } from './AuthenticatedRequest';

export type PlayRequest = AuthenticatedRequest & {
  posicaoCarta: number;
};

export type ForecastRequest = AuthenticatedRequest & {
  quantidade: number;
};

export type RoundRequest = AuthenticatedRequest & {
  quantidade: number;
};
