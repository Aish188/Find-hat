const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let startPlaying = true;

class Field {
    constructor(field) {
        this._field = field;
        this.a = 0;
        this.b = 0;
    }

    get field() {
        return this._field;
    }

    //Print the field to the terminal in a two-dimensional plane
    print() {
        return this.field.map(row =>
            row.join('')
        ).join('\n');
    }

    //Retrieve user's input and move the player's cursor
    giveValue() {
        let move = prompt('Which direction do you want to move to? (u for Up, d for down, l for left and r for right)');
        switch(move.toLowerCase()) {
            case 'u':
                console.log('Moving up');
                this.a -= 1;
                break;
            case 'd':
                console.log('Moving down');
                this.a += 1;
                break;
            case 'l':
                console.log('Moving left');
                this.b -= 1;
                break;
            case 'r':
                console.log('Moving right');
                this.b += 1;
                break;
            default:
                break;
        }    
    }

    //Detect the game status if player wins or loses
    WinOrLose() {
        
        if (this.field[this.a] == undefined) {
            console.log('You lose - Out of boundary');
            return startPlaying = false;            
        }
        //
        switch (this.field[this.a][this.b]) {
            case hole:
                console.log('You lose - You fell in a hole!');
                startPlaying = false;
                break;
            case undefined:
                console.log('You lose - Out of boundary');
                startPlaying = false;
                break;
            case hat:
                console.log('You win - You found the hat!');
                startPlaying = false;
                break;
            case fieldCharacter:
                console.log('Keep looking for the hat...');
                this.field[this.a][this.b] = pathCharacter;
                break;
            case pathCharacter:
                console.log('You are stepping on *');
                break;
        }    
    }

    static generateField(height, width, percentage) {

        //Helper function to return hole or fieldCharacter depening on percentage.
        const fieldOrHole = (percentage) => {
            if (percentage >= 0 && percentage <= 100) {
              const ranNum = Math.random() * 100;
              if (ranNum < percentage) {
                return hole;
              } else {
                return fieldCharacter;
              }
            } 
        }

        ////Helper function to return a plain field with no hat and pathCharacter
        const plainField = () => {
            function makeWidthArray() {
                let widthArray = [];
                for (let i=0; i < width; i++) {
                    widthArray.push(fieldOrHole(percentage));
                }
                return widthArray;
            }
            let plainField = [];
            for (let i=0; i < height; i++) {
                plainField.push(makeWidthArray());
            }
            return plainField;
        }

        const gameReadyField = plainField();

        //Adding hat on gameReadyField, while loop will check if hat sits on * and will reposition if so
        do {
            gameReadyField[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;
        }   while (gameReadyField[0][0] == hat);
        
        //Adding pathCharacter to left-upper corner
        gameReadyField[0][0] = pathCharacter;

        return gameReadyField;
    }

}

//Generating a new randomized field into "newField" and will insert to "myField" below:
//generateField() takes 3 parameters. First is the y-axis, second is x-axis and third id the percentage of holes in the field(Please enter between 0 - 100).

const myField = new Field(Field.generateField(15,15,30));

function game() {
    while(startPlaying) {
        console.log(myField.print());
        myField.giveValue();
        myField.WinOrLose();
    }
    console.log('Game Over!');
}

game();