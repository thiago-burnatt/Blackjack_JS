function getCardSuit() {
    const suitList = ['clubs', 'diamonds', 'hearts', 'spades'];
    const rand = Math.floor(Math.random() * 4);
    return suitList[rand];
};



