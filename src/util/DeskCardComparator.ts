import { Card } from '../domain/Deck';
import { DeskItem } from '../domain/Desk';

export class DeskCardComparator {
  readonly wildCard: Card;

  constructor(wildCard: Card) {
    this.wildCard = wildCard;
  }

  get cardComparator() : (cardA: Card, cardB: Card) => number {
    return this.compareCard.bind(this);
  }
  
  get deskItemComparator() : (itemA: DeskItem, itemB: DeskItem) => number {
    return this.compareDeskItem.bind(this);
  }
  
  private compareCard(cardA: Card, cardB: Card) : number {
    const wildCardTypeA = this.getWildCardType(cardA);
    const wildCardTypeB = this.getWildCardType(cardB);
    if (wildCardTypeA != wildCardTypeB) {
      return wildCardTypeA - wildCardTypeB;
    }    
    if (cardA.valuedNumber != cardB.valuedNumber) {
      return cardA.valuedNumber - cardB.valuedNumber;
    }
    return 0;
  }

  private compareDeskItem(itemA: DeskItem, itemB: DeskItem) : number {
    const cardA = itemA.card;
    const cardB = itemB.card;
    
    const cardResult = this.compareCard(cardA, cardB);
    if (cardResult != 0) return cardResult;

    // maior posicao tem peso menor
    return itemB.position - itemA.position;
  }

  private getWildCardType(card: Card) {
    const isWild = this.wildCard.suit == card.suit;
    const sameValue = this.wildCard.value == card.value;
    if (isWild && sameValue) return 2;
    if (isWild) return 1;
    return 0;
  }
}