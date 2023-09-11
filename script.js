const bj = new Blackjack();

//initialize screen and button event listeners
document.getElementById('betting-screen').style.display = 'none';
document.getElementById('deal-screen').style.display = 'none';

document.getElementById('play').addEventListener('click', start);
document.getElementById('continue').addEventListener('click', start);
document.getElementById('bet-increase').addEventListener('click', increment);
document.getElementById('bet-decrease').addEventListener('click', decrement);
document.getElementById('deal').addEventListener('click', deal);
document.getElementById('stand').addEventListener('click', stand);
document.getElementById('hit').addEventListener('click', playerHit);

function cascadeDelayCalls(functions, delay) {
    let time = 0;
    functions.forEach( func => {
        setTimeout(func, time);
        time += delay;
    })
}

function increment() {
    const bet = bj.bet+100 > bj.money ? bj.bet : bj.bet+100;
    bj.setBet(bet);
    document.getElementById('bet').textContent = `Bet: $${bet}`;
}

function decrement() {
    const bet = bj.bet-100 > 0 ? bj.bet-100 : bj.bet;
    bj.setBet(bet);
    document.getElementById('bet').textContent = `Bet: $${bet}`;
}

function start() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('deal-screen').style.display = 'none';
    document.getElementById('betting-screen').style.display = 'grid';
    document.getElementById('money').textContent = `Money: $${bj.money}`;
    document.getElementById('bet').textContent = `Bet: $${bj.bet}`;
    document.getElementById('stand').style.display = 'initial';
    document.getElementById('hit').style.display = 'initial';
}

function deal() {
    const elements = document.getElementsByClassName('cards')
    Array.from(elements).forEach(el => {
        el.innerHTML = '';
    })
    bj.resetTable();
    document.getElementById('betting-screen').style.display = 'none';
    document.getElementById('deal-screen').style.display = 'grid';
    cascadeDelayCalls([
        () => dealerHit(false),
        playerHit,
        dealerHit,
        playerHit
    ], 350)
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    if (!card.show) cardDiv.classList.add('hidden');
    const cardRank = document.createElement('span');
    cardRank.textContent = `${card.rank.name}|${card.rank.value} `;
    const cardSuit = document.createElement('span');
    cardSuit.textContent = `${card.suit.name}`;
    cardDiv.appendChild(cardRank);
    cardDiv.appendChild(cardSuit);
    return cardDiv
} 

function dealerHit(show=true) {
    bj.dealerHit(show);
    const drawnCard = bj.dealerHand.cards[bj.dealerHand.cards.length-1];
    appendCardElement(drawnCard, 'dealer-hand')
}

function playerHit(show=true) {
    bj.playerHit(show);
    if (bj.playerHand.isBust()) lose();
    const drawnCard = bj.playerHand.cards[bj.playerHand.cards.length-1];
    appendCardElement(drawnCard, 'player-hand')
}

function appendCardElement(card, parentHandId) {
    const cardsElement = document.getElementById(parentHandId);
    cardsElement.appendChild(createCardElement(card));
}

function stand() {
    document.getElementById('stand').style.display = 'none';
    document.getElementById('hit').style.display = 'none';
    dealerTurn();
}

function dealerTurn() {
    const shouldHit = () => {
        // Hard coded approximation to bust on next hit
        const successProbability = (BUST_LIMIT-bj.dealerHand.getTotal())/10;
        return Math.random() < successProbability;
    }

    document.getElementById('dealer-hand').firstChild.classList.remove("hidden");
    bj.dealerHand.cards[0].flip();

    // delayed card draws and match result
    let eventList = []
    while (shouldHit()) {
        bj.dealerHit(true);
        const drawnCard = bj.dealerHand.cards[bj.dealerHand.cards.length-1];
        eventList.push(() => { 
            appendCardElement(drawnCard, 'dealer-hand')
        });
        if (bj.dealerHand.isBust()) break;
    }
    const roundResult = () => {
        if (bj.dealerHand.isBust()) win();
        else if (bj.playerHand.getTotal() == bj.dealerHand.getTotal()) {
            tie();
        }
        else if (bj.playerHand.getTotal() > bj.dealerHand.getTotal()) {
            win();
        } else {
            lose();
        }
    }
    eventList.push(roundResult);
    cascadeDelayCalls(eventList, 700);
}


function lose() {
    document.getElementById('stand').style.display = 'none';
    document.getElementById('hit').style.display = 'none';
    showMessage(`lose -$${bj.bet}`, start)
    bj.lose()
}

function win() {
    document.getElementById('stand').style.display = 'none';
    document.getElementById('hit').style.display = 'none';
    showMessage(`win +$${bj.bet}`, start)
    bj.win()
}

function tie() {
    document.getElementById('stand').style.display = 'none';
    document.getElementById('hit').style.display = 'none';
    showMessage("tie", start)
}

function showMessage(text) {
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('message').textContent = text;
}