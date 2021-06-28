var x = 720;
var y = 720;

var maps = {
    map1: {
        name: 'Map 1',
        map: {x: 10, y: 10},
        score: 20
    },
};
var spriteX = 75;
var spriteY = 80;

let map1 = maps.map1;
var currentMap = map1;

// level settings
var needPoints = 1000;
var points = 0;
var steps = 10;
var maxSteps = 10;
var canClick = true;
var finish = false;



x = (currentMap.map.x) * spriteX;
y = (currentMap.map.y + 1) * spriteY;

var game = new Phaser.Game(x, y+(spriteY/2), Phaser.AUTO, 'game', {preload: preload, create: create, update: update});


var score = 0;

var wait = true;


function preload() {
    game.load.image('blue', './img/blast/blue.png');
    game.load.image('red', './img/blast/red.png');
    game.load.image('green', './img/blast/green.png');
    game.load.image('yellow', './img/blast/yellow.png');
    game.load.image('purple', './img/blast/purple.png');
    game.load.image('pause', './img/blast/pause.png');

}


function create() {
    if (document.body.clientWidth < 1080) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    var objectsMap = [];
    var valuesMap = [];

    game.stage.backgroundColor = "#4a7faa";


    function firstGenerate(map) {
        y = (currentMap.map.y*spriteY) - (spriteY/2);
        objectsMap = [];
        for (let i = map.map.y; i >= 0; i--) {
            let level = [];
            x = 2;
            if(objectsMap[i] === undefined) {
                objectsMap[i] = [];
            }
            if(valuesMap[i] === undefined) {
                valuesMap[i] = [];
            }

            for (let b = 0; b < map.map.x; b++) {
                tile = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                if (tile == 1) {
                    player = game.add.sprite(x, y, 'red');
                } else if (tile == 2) {
                    player = game.add.sprite(x, y, 'blue');
                } else if (tile == 3) {
                    player = game.add.sprite(x, y, 'green');
                } else if (tile == 4) {
                    player = game.add.sprite(x, y, 'purple');
                } else if (tile == 5) {
                    player = game.add.sprite(x, y, 'yellow');
                }

                player.scale.set(0.2, 0.2);

                level.push(player);

                valuesMap[i][b] = tile;
                x += 75;


                // comeon
                player.inputEnabled = true;
                player.input.useHandCursor = true;
                player.customParams = {};
                player.customParams.x = b;
                player.customParams.y = i;
                player.customParams.tile = tile;

                player.events.onInputDown.add((event) => {
                    player.customParams.x = b;
                    player.customParams.y = i;
                    console.log("levelX: ",  player.customParams);
                    if(!finish && canClick && check(player.customParams.x, player.customParams.y)) {
                        canClick = false;
                        steps--;
                        setText();
                        setTimeout(() => {
                            checkedMap();
                        }, 500)
                    }

                }, this);
                objectsMap[i][b] = player;
            }
            y -= 75;
            newMap.push(level);
        }
    }

    x = 0;
    y = 0;
    newMap = [];
    var player;

    firstGenerate(currentMap);
    console.log(objectsMap);
    console.log(valuesMap);

    function check(x,y, destroy = false, pos = "") {
        let res = false;
        let checkMap = false;
        // let currentTile = objectsMap[y][x].customParams.tile;
        let currentTile = valuesMap[y][x];
        if(currentTile === 0) {
            console.log("CurrentTile: ", currentTile);
            return false
        }

        if(pos !== "right" && x > 0 && valuesMap[y][x-1] == currentTile) {
            score+=50;
            deleteSprite(x,y);
            setTimeout(() => {
                check(x-1,y, true, "left");
            }, 10)
            res = true;
        }
        if(pos !== "left" && x < objectsMap[y].length-1 && valuesMap[y][x+1]== currentTile) {
            score+=50;
            deleteSprite(x,y);
            setTimeout(() => {
                check(x+1,y, true, "right");
            }, 10)
            res = true;
        }
        if(pos !== "bottom" && y > 0 && valuesMap[y-1][x] == currentTile) {
            score+=50;
            deleteSprite(x,y);
            setTimeout(() => {
                check(x,y-1, true, "top");
            }, 10)
            res = true;
        }
        if(pos !== "top" && y < objectsMap.length-1 && valuesMap[y+1][x] == currentTile) {
            score+=50;
            deleteSprite(x,y);
            setTimeout(() => {
                check(x,y+1, true, "bottom");
            }, 10)
            res = true;
        }

        if(destroy) {
            deleteSprite(x,y);
        }


        return res;
    }

    function checkEmpty() {
        for(let c = 0; c < valuesMap[0].length; c++) {
            if(valuesMap[0][c] == 0) {
                objectsMap[0][c] = getNew(0,c);
                valuesMap[0][c] = objectsMap[0][c].customParams.tile;
            }
        }
    }

    function checkedMap() {
        checkEmpty();
        for(let yy = valuesMap.length-1; yy >= 0; yy--) {
            for(let xx = 0; xx <= objectsMap[yy].length-1; xx++) {
                if(valuesMap[yy][xx] == 0) {
                    let returned = 0;
                    let reval = 0;
                    for(let cc = yy-1; cc >= 0; cc--) {
                        reval++;
                        if(valuesMap[cc][xx] !== 0) {
                            returned = cc;
                            break;
                        }
                    }
                       if(returned >= 0) {
                           let posY = objectsMap[returned][xx].position.y;
                           valuesMap[yy][xx] = valuesMap[returned][xx];
                           console.log("new val:", valuesMap[yy][xx]);
                           valuesMap[returned][xx] = 0;
                           posY+= ((reval)*75);
                           game.add.tween(objectsMap[returned][xx]).to({y: posY}, 500, "Linear", true, 0);
                           objectsMap[yy][xx] = objectsMap[returned][xx];
                           objectsMap[returned][xx].events.onInputDown.removeAll();
                           objectsMap[returned][xx].events.onInputDown.add((event) => {
                               if(!finish && canClick && check(xx, yy)) {
                                   canClick = false;
                                   steps--;
                                   setText();
                                   setTimeout(() => {
                                       checkedMap();
                                   }, 500)
                               }
                           }, this);
                           checkEmpty();
                       }
                }
            }
        }
        canClick = true;
    }

    function deleteSprite(x, y) {
        game.add.tween(objectsMap[y][x]).to({alpha: 0}, 500, "Linear", true, 0);
        setTimeout(() => {
            objectsMap[y][x].destroy();
        }, 200)
        valuesMap[y][x] = 0;
    }



    function bounce(x, y, current = 0, pos) {

        // need y and x delete object

    }

    function getNew(needY, needX) {
        let y = needY+10;
        let player;
        let x = (needX*75)+2;
        let tile = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        if (tile == 1) {
            player = game.add.sprite(x, y, 'red');
        } else if (tile == 2) {
            player = game.add.sprite(x, y, 'blue');
        } else if (tile == 3) {
            player = game.add.sprite(x, y, 'green');
        } else if (tile == 4) {
            player = game.add.sprite(x, y, 'purple');
        } else if (tile == 5) {
            player = game.add.sprite(x, y, 'yellow');
        }

        player.scale.set(0.2, 0.2);
        player.inputEnabled = true;
        player.input.useHandCursor = true;
        player.customParams = {};
        player.customParams.tile = tile;

        player.events.onInputDown.add((event) => {
            player.customParams.x = x;
            player.customParams.y = y;
            console.log("levelX: ",  player.customParams);
            deleteSprite(player.customParams.x, player.customParams.y);
        }, this);
        return player;
    }

    stepsText = game.add.text(0, game.height - spriteY / 2, 'Steps: ' + steps, {fill: '#efefef'});
    scoreText = game.add.text(x / 2 - 40, game.height - spriteY / 2, 'Score: ' + score, {fill: '#efefef'});



    function setText() {
        // set new text
        stepsText.setText("Steps: " + steps + "/" +maxSteps);
        scoreText.setText("Score: " + score + "/" + needPoints);

    }
}

function update() {
    if(steps <= 0 && score < needPoints) {
        finish = true;
        game.add.text( game.width / 2, game.height / 2, 'You loose, score: ' + score + ' of '+needPoints, {
            fill: '#efefef',
            font: 'bold 36px',
            padding : '40px',
            backgroundColor: '#000',
        }).anchor.setTo(0.5, 0.5);
    }   else if(score >= needPoints) {
        finish = true;
        game.add.text( game.width / 2, game.height / 2, 'You win, steps: ' + (maxSteps-steps) + ' of ' + maxSteps,{
            fill: '#efefef',
            font: 'bold 36px',
            padding : '40px',
            backgroundColor: '#000',
        }).anchor.setTo(0.5, 0.5);
    }
}




