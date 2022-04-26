import { Deck } from '../Deck';

describe('deck', () => {
  it('should have all deck cards', async() => {
    const scrambled = Deck.getScrambled();
    expect(scrambled).toHaveLength(104);
  });
});