const BUST_LIMIT = 21;

// Fake enum in js
class Suit {
    constructor(name) {
        this.name = name;
    }
    static CLUBS = new Suit("clubs");
    static DIAMONDS = new Suit("diamonds");
    static HEARTS = new Suit("hearts");
    static SPADES = new Suit("spades");
}

// Fake enum in js
class Rank {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    static ONE = new Rank("one", 1);
    static TWO = new Rank("two", 2);
    static THREE = new Rank("three", 3);
    static FOUR = new Rank("four", 4);
    static FIVE = new Rank("five", 5);
    static SIX = new Rank("six", 6);
    static SEVEN = new Rank("seven", 7);
    static EIGHT = new Rank("eight", 8);
    static NINE = new Rank("nine", 9);
    static JACK = new Rank("jack", 10);
    static QUEEN = new Rank("queen", 10);
    static KING = new Rank("king", 10);
    static ACE = new Rank("ace", [1, 11]);
}

class Deck {
    constructor() {
        this.cards = [];
    }

    init() {
        // Fill deck with standard 52 cards of every rank and suit
        this.cards = [];
        for (let rank in Rank) {
            for (let suit in Suit) {
                this.cards.push(new Card(Rank[rank], Suit[suit]));
            }
        }
    }

    deal() {
        return this.cards.pop()
    }

    shuffle() {
        // Following Fisher-Yates method
        for (let i = this.cards.length-1; i>0; i--) {
            const randIndex = ~~(Math.random()*(i+1));
            const swap = this.cards[i];
            this.cards[i] = this.cards[randIndex];
            this.cards[randIndex] = swap;
        }
    }
}

class Card {
    constructor(rank, suit, show=true) {
        this.rank = rank,
        this.suit = suit,
        this.show = show
    }

    flip() {
        this.show = !this.show;
    }
}

class Hand {
    constructor(cards) {
        this.cards = [...cards];
    }

    isBust() {
        return this.getTotal() > BUST_LIMIT;
    }

    getTotal() {
        let total = 0;
        let aces = []
        for (let card of this.cards) {
            if (card.rank.name === "ace") aces.push(card);
            else total += card.rank.value;
        }
        // Handle aces last
        for (let ace of aces) {
            const aceValues = ace.rank.value;
            total += total+aceValues[1] > BUST_LIMIT ? aceValues[0] : aceValues[1];
        }
        return total
    }

    draw(card) {
        this.cards.push(card);
    }

    clear() {
        this.cards = [];
    }
}

class Blackjack {
    constructor() {
        this.deck = new Deck();
        this.playerHand = new Hand([]);
        this.dealerHand = new Hand([]);
        this.money = 1000;
        this.bet = 100;
    }

    resetTable() {
        this.playerHand.clear();
        this.dealerHand.clear();
        this.deck.init();
        this.deck.shuffle();
    }

    playerHit(show=true) {
        this.hit(this.playerHand, show);
    }

    dealerHit(show=true) {
        this.hit(this.dealerHand, show);
    }

    hit(hand, show=true) {
        let card = this.deck.deal();
        if (!show) card.flip();
        hand.draw(card);
    }

    setBet(value) {
        this.bet = value;
    }

    win() {
        this.money += this.bet;
        this.bet = 100;
    }

    lose() {
        this.money -= this.bet;
        this.bet = 100;
    }
}