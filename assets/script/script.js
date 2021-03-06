class Blackjack {
    constructor() {
        this.divPlayerCards = document.querySelector('.cards');
        this.divDealerCards = document.querySelector('.cards-dealer');
        this.scoreDiv = document.querySelector('#score-id');

        this.playerScore = 0;
        this.dealerScore = 0;

        this.scoreMessage = document.querySelector('.score-message');
        this.setBettingBtn = document.querySelector('.new-card-btn');
        this.stopBtn = document.querySelector('.stop');

        this.balanceDisplay = document.querySelector('.balance-display');
        this.balanceInput = document.querySelector('#balance');

        this.bettingDisplay = document.querySelector('.betting-display');
        this.bettingInput = document.querySelector('#betting');

        this.bettingValue = 0;
        this.balanceValue = 0;

        this.events();
    }

    events() {
        document.addEventListener('click', e => {
            const el = e.target;

            if (el.classList.contains('set-betting-btn')) {
                if (!this.balanceValue) {
                    if (Number(this.balanceInput.value) < Number(this.bettingInput.value)) {
                        this.setMsgScore('Balance value must be higher than betting value')
                        setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
                        this.setTimeOut();
                        return;
                    }
                }

                this.setBalance(document.querySelector('#balance')); //Param: balance
                this.setBetting(this.bettingInput);

            };

            if (el.classList.contains('new-card-btn')) {
                if (this.bettingValue > this.balanceValue) {
                    this.setMsgScore('Balance value must be higher than betting value')
                    setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
                    this.setTimeOut();
                    return;
                }
                if (!this.balanceValue || !this.bettingValue) {
                    this.setMsgScore('Please set inicial balance and betting value first')
                    setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
                    this.setTimeOut();
                    return;
                }
                this.setCardOnScreen(this.getFullCard(this.getCardNumber(), this.getCardSuit()), this.divPlayerCards);
                this.checkPlayerScore();

                this.restart();

            };

            if (el.classList.contains('stop')) {
                if (this.bettingValue > this.balanceValue) {
                    this.setMsgScore('Balance value must be higher than betting value')
                    setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
                    this.setTimeOut();
                    return;
                }

                if (!this.balanceValue || !this.bettingValue) {
                    this.setMsgScore('Please set inicial balance and betting value first')
                    setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
                    this.setTimeOut();
                    return;
                }

                while (this.dealerScore < 16) {
                    this.setCardOnScreen(this.getFullCardDealer(
                        this.getCardNumber(),
                        this.getCardSuit()),
                        this.divDealerCards);
                }
                setTimeout(() => {this.stopRound()}, 800);
                
                this.setBettingBtn.setAttribute('disabled', true);
                this.setTimeOut();
                this.restart();
            }

            if (el.classList.contains('exit')) {
                if (!this.balanceInput.value || !this.bettingInput.value) {
                    this.setMsgScore('Please set balance and betting values first');
                    this.setTimeOut();
                    return;
                }
                this.confirmAction('Are you sure?');
            }

            if (el.classList.contains('exit-confirm')) {
                this.exitGame();
                this.restart();
                this.resetDisplay();
                this.resetScores();
                this.resetBalance();
                this.setTimeOut();
            }

            if (el.classList.contains('exit-not-confirm')) {
                this.scoreDiv.removeAttribute('class');
                const confirmDiv = document.getElementsByClassName('msg');
                confirmDiv[0].remove();
            }
        });
    };

    // Get balance value from imput and set it at screen and into variable 'BalanceValue'
    setBalance(balance) {
        if (!balance.value) {
            this.setMsgScore('Please set a inicial balance')
            setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
            this.setTimeOut();
            return;
        }
        if (!this.balanceValue) {
            this.balanceValue = Number(balance.value);
        }
        this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;
        const balanceInput = document.querySelector('#balance');
        balanceInput.setAttribute('disabled', true);
    };

    // Get betting value from imput and set it at screen and into variable 'BettingValue'
    setBetting(betting) {
        if (Number(betting.value <= 0) || Number(betting.value > this.balanceValue)) {
            this.setMsgScore('The betting must be higher then 0 and smaller then balance')
            setTimeout(() => { this.scoreDiv.removeAttribute('class') }, 3000)
            this.setTimeOut();
            return;
        }
        if (!this.balanceInput) return;

        this.bettingValue = Number(betting.value);
        this.bettingDisplay.innerHTML = `$ ${this.bettingValue.toFixed(2)}`;
    }

    // Return a number between 1 and 13
    getCardNumber(max = 13) {
        return Math.ceil(Math.random() * max)
    }

    // Return a suit
    getCardSuit() {
        const suitList = ['clubs', 'diamonds', 'hearts', 'spades'];
        const rand = Math.floor(Math.random() * 4);
        return suitList[rand];
    };

    // Return the joint of number and suit as img src
    getFullCard(number, suit) {
        this.playerScore += number;
        return '/assets/img/' + number + suit + '.png';
    }

    getFullCardDealer(number, suit) {
        this.dealerScore += number;
        return '/assets/img/' + number + suit + '.png';
    }

    // Get the complete card and set it on screen
    // Parameters: 
    // number = getCardNumber()
    // suit = getCardSuit()
    // fullCard = this.getFullCard(this.getCardNumber(), this.getCardSuit())

    setCardOnScreen(fullCard, divCards) {
        const addImg = document.createElement('img');
        addImg.setAttribute('src', fullCard);
        addImg.classList.add('card-list');
        divCards.appendChild(addImg);
    };
    // Erase all cards from screen
    eraseCards() {
        const cardList = document.getElementsByClassName("card-list");

        for (let i = cardList.length - 1; i >= 0; i--) {
            cardList[i].remove();
        }

    };

    // Check the current player score and sets new balance value in case of win or lose
    checkPlayerScore() {
        if (this.playerScore === 21) {
            this.balanceValue += this.bettingValue * 2;
            this.scoreMessage = `Blackjack!! You won $ ${this.bettingValue * 2}`;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;

            this.setMsgScore(this.scoreMessage);

            this.setBtnOff();
            this.setTimeOut();
            this.resetScores();
            return;

        } if (this.playerScore > 21) {
            this.balanceValue -= this.bettingValue;
            this.scoreMessage = `Scored ${this.playerScore} points, you lost $ ${this.bettingValue}`;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;

            this.setMsgScore(this.scoreMessage);

            this.setBtnOff();
            this.setTimeOut();
            this.resetScores();
            return;
        }
    }

    // When the player stop asking cards, the dealer gets its cards
    stopRound() {
        if (this.dealerScore > 21) {
            this.scoreMessage = `Dealer scored ${this.dealerScore}, You got $ ${this.bettingValue * 2}`;
            this.balanceValue += this.bettingValue * 2;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;

            this.setMsgScore(this.scoreMessage);

            this.setBtnOff();
            this.setTimeOut();
            this.resetScores();
            return;
        }

        if (this.dealerScore > this.playerScore) {
            this.balanceValue -= this.bettingValue;
            this.scoreMessage = `Dealer scored ${this.dealerScore}! You lost $ ${this.bettingValue}`;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;
            this.setMsgScore(this.scoreMessage);
            this.setBtnOff();
            this.setTimeOut();
            this.resetScores();
            return;
        }

        if (this.dealerScore === this.playerScore) {
            this.scoreMessage = `Even! You got $ ${this.bettingValue}`;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;
            this.setMsgScore(this.scoreMessage);
            this.setBtnOff();
            this.setTimeOut();
            this.resetScores()
            return;
        }

        if (this.dealerScore < this.playerScore) {
            this.scoreMessage = `Win! You got $ ${this.bettingValue * 2}`;
            this.balanceValue += this.bettingValue * 2;
            this.balanceDisplay.innerHTML = `$ ${this.balanceValue.toFixed(2)}`;
            this.setMsgScore(this.scoreMessage);
            this.setBtnOff();
            this.setTimeOut();
            this.resetScores();
            return;
        }
    }

    resetScores() {
        this.playerScore = 0;
        this.dealerScore = 0;
    }

    resetBalance() {
        this.bettingValue = 0;
        this.balanceValue = 0;
    }


    resetDisplay() {
        this.balanceInput.removeAttribute('disabled');
        this.balanceDisplay.innerHTML = '';
        this.bettingDisplay.innerHTML = '';
        this.balanceInput.value = '';
        this.bettingInput.value = '';
    }

    // Button disable to prevent player getting new cards after match ends
    setBtnOff() {
        this.setBettingBtn.setAttribute('disabled', true);
        this.stopBtn.setAttribute('disabled', true);
    }

    // Set time out to clean the screen after end of round
    // Clears messeges
    setTimeOut() {
        setTimeout(() => {
            this.eraseCards(),
                this.setBettingBtn.removeAttribute('disabled'),
                this.stopBtn.removeAttribute('disabled');
            this.scoreDiv.removeAttribute('class');
            const msgList = document.getElementsByClassName('msg');
            if (msgList) {
                for (let i = msgList.length - 1; i >= 0; i--) {
                    msgList[i].remove();
                }
            }
        }, 3000);
    }

    // Set warning messages on screen
    setMsgScore(msg) {
        setTimeout(() => {
            this.scoreDiv.setAttribute('class', 'score-msg');
            const addMsg = document.createElement('p');
            addMsg.setAttribute('class', 'msg');
            addMsg.innerHTML = msg;
            this.scoreDiv.appendChild(addMsg);
        }, 400)
    }

    confirmAction(msg) {
        this.scoreDiv.setAttribute('class', 'score-msg');
        const addMsg = document.createElement('p');
        addMsg.setAttribute('class', 'msg');
        addMsg.innerHTML = msg;
        this.scoreDiv.appendChild(addMsg);
        const divBtn = document.createElement('div');
        divBtn.setAttribute('class', 'div-buttons');
        addMsg.appendChild(divBtn);
        const button1 = document.createElement('button');
        button1.innerHTML = 'Yes';
        button1.setAttribute('class', 'exit-confirm');
        divBtn.appendChild(button1);
        const button2 = document.createElement('button');
        button2.innerHTML = 'No';
        button2.setAttribute('class', 'exit-not-confirm');
        divBtn.appendChild(button2);
    }


    // Shows game-over message and resets all parameters
    restart() {
        if (!this.balanceValue) {

            setTimeout(() => {
                this.confirmAction(`Game over! <br> Do you want play again?`);
            }, 3000);
            
            this.balanceInput.removeAttribute('disabled');
            this.balanceDisplay.innerHTML = '';
            this.bettingDisplay.innerHTML = '';
            this.balanceInput.value = '';
            this.bettingInput.value = '';
        }
    }

    exitGame() {
        const finalBalance = this.balanceValue - (Number(this.balanceInput.value));
        if (this.balanceValue > Number(this.balanceInput.value)) {
            this.setMsgScore(`Congratulations, you earned $ ${finalBalance}!`);
            return;
        }

        if (this.balanceValue < Number(this.balanceInput.value)) {
            this.setMsgScore(`Too bad, you lost $ ${finalBalance * -1}`);
            return;
        }

        if (!this.bettingInput.value || !this.balanceInput.value) {
            this.setMsgScore('Starting a new game...');
            return;
        }

        if (this.balanceValue === Number(this.balanceInput.value)) {
            this.setMsgScore('You ended the game with same balance than the start!');
            return;
        }

    }

}

const game = new Blackjack();
