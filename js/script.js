var x = 720;
var y = 720;

var maps = {
    map1: {
        name: 'Map 1',
        map: {x: 5, y: 7},
        score: 20
    },
};
var spriteX = 80;
var spriteY = 80;

let map1 = maps.map1;
var currentMap = map1;


if (localStorage.map > 0) {
    console.log(localStorage);
    // if(localStorage.map == 1) {
    //     currentMap = map1;
    // } else if (localStorage.map == 2) {
    //     currentMap = map2;
    // }
}
console.log('currentMap:', currentMap);
x = (currentMap.map.x) * spriteX;
y = (currentMap.map.y + 1) * spriteY;

var game = new Phaser.Game(x, y, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});


var score = 0;

var selected = [];
var selected1 = null;
var selected2 = null;
var wait = true;


function preload() {
    game.load.image('blue', './img/blast/blue.png');
    game.load.image('red', './img/blast/red.png');
    game.load.image('green', './img/blast/green.png');
    game.load.image('yellow', './img/blast/yellow.png');
    game.load.image('purple', './img/blast/purple.png');
    game.load.image('pause', './img/blast/pause.png');

    game.load.image('select', './img/select.png');
    game.load.image('background', './img/background.jpg');

}


function create() {
    if (document.body.clientWidth < 1080) {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    game.stage.backgroundColor = "#4a7faa";
    // background = game.add.tileSprite(0, 0, game.height, game.width, 'background');


    x = 0;
    y = 0;
    newMap = [];
    var player;

    firstGenerate(currentMap);


    function firstGenerate(map) {
        for (let i = 0; i < map.map.y; i++) {
            let level = [];
            x = 0;
            for (let i = 0; i < map.map.x; i++) {
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
                x += 80;

                player.inputEnabled = true;
                player.input.useHandCursor = true;
                player.events.onInputDown.add(function (event) {
                    positions = event.position;
                    levelX = positions.x / 80;
                    levelY = positions.y / 80;
                    key = event.key;
                    if (check(key, levelX, levelY)) {
                        score++;
                        textLevel.destroy();
                        textLevel = game.add.text(0, game.height - spriteY / 2, 'Score: ' + score, {fill: '#efefef'});
                        setTimeout(function () {
                            mapGenerate(newMap);
                        }, 1700)
                    } else {
                        select(key, levelX, levelY);
                    }
                }, this);
            }
            y += 80;
            newMap.push(level);
            selected.push([]);
        }
        levelName = game.add.text(x / 2 - 40, game.height - spriteY / 2, map.name, {fill: '#efefef'});
    }

    console.log(newMap);

    function select(key, levelX, levelY) {
        if (newMap[levelY][levelX] == 0) {
            return false;
        }
        x = newMap[levelY][levelX].position.x;
        y = newMap[levelY][levelX].position.y;

        if (selected1 == null) {
            selectedObject1 = game.add.sprite(x, y, 'select');
            selectObject1 = newMap[levelY][levelX];
            selected1 = selectObject1;
        } else if (selected2 == null) {
            selectedObject2 = game.add.sprite(x, y, 'select');
            selectObject1 = newMap[levelY][levelX];
            selected2 = selectObject1;
            if (checkForTransition(selected1, selected2)) {
                console.log('OMG');
                newMap[selected1.position.y / spriteY][selected1.position.x / spriteX] = selected2;
                newMap[selected2.position.y / spriteY][selected2.position.x / spriteX] = selected1;
                game.add.tween(selected1).to({
                    x: selected2.position.x,
                    y: selected2.position.y
                }, 300, "Linear", true, 0);
                game.add.tween(selected2).to({
                    x: selected1.position.x,
                    y: selected1.position.y
                }, 300, "Linear", true, 0);
                setTimeout(function () {
                    mapGenerate(newMap);
                }, 500);
                setTimeout(function () {
                    checkAllMap(newMap);
                    setTimeout(function () {
                        checkAllMap(newMap);
                    }, 1500);
                }, 1000);

                if (localStorage.map == 1) {
                    localStorage.map = 2;
                } else {
                    localStorage.map = 1;
                }

                dest();
            } else {
                dest();
                selectedObject1 = game.add.sprite(x, y, 'select');
                selectObject1 = newMap[levelY][levelX];
                selected1 = selectObject1;
            }

        }

        function dest() {
            selectedObject1.destroy();
            selectedObject2.destroy();
            selected1 = null;
            selected2 = null;
        }
    }

    function mapGenerate(map) {
        for (let xy = 0; xy < map.length; xy++) {
            for (let i = 0; i < map[xy].length; i++) {
                if (map[xy][i] == 0) {
                    tile = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                    if (tile == 1) {
                        player = game.add.sprite(i * spriteX, xy * spriteY, 'blue');
                    } else if (tile == 2) {
                        player = game.add.sprite(i * spriteX, xy * spriteY, 'red');
                    } else if (tile == 3) {
                        player = game.add.sprite(i * spriteX, xy * spriteY, 'yellow');
                    } else if (tile == 4) {
                        player = game.add.sprite(i * spriteX, xy * spriteY, 'purple');
                    } else if (tile == 5) {
                        player = game.add.sprite(i * spriteX, xy * spriteY, 'green');
                    }
                    player.scale.set(0.2, 0.2);
                    newMap[xy][i] = player;

                    player.alpha = 0;
                    game.add.tween(player).to({alpha: 1}, 500, "Linear", true, 0);
                    player.inputEnabled = true;
                    player.input.useHandCursor = true;
                    player.events.onInputDown.add(function (event) {
                        positions = event.position;
                        levelX = positions.x / 80;
                        levelY = positions.y / 80;
                        key = event.key;
                        alert(check(key, levelX, levelY));
                        if (check(key, levelX, levelY)) {
                            setTimeout(function () {
                                mapGenerate(newMap);
                            }, 1000)
                        } else {
                            select(key, levelX, levelY);
                        }
                        ;
                    }, this);
                }
            }

        }
        console.log(newMap);
    }

    textLevel = game.add.text(0, game.height - spriteY / 2, 'Score: ' + score, {fill: '#efefef'})


    var myInterval = setInterval(function () {
        // if (!checkAllMap(newMap)) {
        clearInterval(myInterval);
        // };
    }, 2500);

    function checkAllMap(map) {
        for (let xy = 0; xy < map.length; xy++) {
            for (let xx = 0; xx < map[xy].length; xx++) {
                let event = map[xy][xx];
                if (event != 0) {
                    positions = event.position;
                    let levelX = positions.x / 80;
                    let levelY = positions.y / 80;
                    let key = event.key;
                    if (check(key, levelX, levelY)) {
                        score++;
                        textLevel.destroy();
                        textLevel = game.add.text(0, game.height - spriteY / 2, 'Score: ' + score, {fill: '#efefef'})
                        setTimeout(function () {
                            mapGenerate(newMap);
                        }, 1500);
                        return true;
                    }
                }
            }
        }
        return false;
    }
}


// Сложиться ли если перенесём фигуру
function checkForTransition(object1, object2) {

    // Если на одной ширине
    if ((object1.position.x < object2.position.x && object2.position.x - object1.position.x <= spriteX && object1.position.y == object2.position.y) ||
        (object1.position.x > object2.position.x && object1.position.x - object2.position.x <= spriteX && object1.position.y == object2.position.y)) {
        console.clear();
        object1Y = object1.position.y / spriteY;
        object1X = object1.position.x / spriteX;
        object2Y = object2.position.y / spriteY;
        object2X = object2.position.x / spriteX;
        // Если сверху и снизу
        if (((object2Y - 1 >= 0 && object2Y + 1 < newMap.length)
            && newMap[object2Y - 1][object2X].key == object1.key && newMap[object2Y + 1][object2X].key == object1.key
            && newMap[object2Y - 1][object2X] != undefined && newMap[object2Y - 1][object2X] != 0)
            || ((object1Y - 1 >= 0 && object1Y + 1 < newMap.length)
                && (newMap[object1Y - 1][object1X].key == object2.key &&
                    newMap[object1Y + 1][object1X].key == object2.key && newMap[object1Y - 1][object1X] != undefined && newMap[object1Y - 1][object1X] != 0))) {
            return true;

            // Если 2 сверху или 2 снизу
        } else if (object1Y - 1 > 0 && object1Y - 2 >= 0 &&
            (newMap[object2Y - 1][object2X].key == object1.key && newMap[object2Y - 2][object2X].key == object1.key)) {
            console.log('Объек 1 встаёт на место 2')
            return true;
        } else if (object1Y + 1 < newMap.length && object1Y + 2 <= newMap.length &&
            (newMap[object2Y + 1][object2X].key == object1.key && newMap[object2Y + 2][object2X].key == object1.key)) {
            console.log('Объек 2 встаёт на место 1')
            return true;
        } else if (object2Y - 1 > 0 && object2Y - 2 >= 0 &&
            (newMap[object1Y - 1][object1X].key == object2.key && newMap[object1Y - 2][object1X].key == object2.key)) {
            return true;
        } else if (object2Y + 1 < newMap.length && object2Y + 2 <= newMap.length &&
            (newMap[object1Y + 1][object1X].key == object2.key && newMap[object1Y + 2][object1X].key == object2.key)) {
            return true;
        }
        if (object2X + 1 < newMap[0].length && object2X + 2 <= newMap[0].length &&
            newMap[object2Y][object2X + 1].key == object1.key && newMap[object2Y][object2X + 2].key == object1.key) {
            console.log('right 3 v1');
            return true;
        }
        if (object1X + 1 < newMap[0].length && object1X + 2 <= newMap[0].length &&
            newMap[object1Y][object1X + 1].key == object2.key && newMap[object1Y][object1X + 2].key == object2.key) {
            console.log('right 3 v2');
            return true;
        }
        if (object1X - 1 > 0 && object1X - 2 >= 0 &&
            newMap[object1Y][object1X - 1].key == object2.key && newMap[object1Y][object1X - 2].key == object2.key) {
            console.log('left 3 v1');
            return true;
        }
        if (object2X - 1 > 0 && object2X - 2 >= 0 &&
            newMap[object2Y][object2X - 1].key == object1.key && newMap[object2Y][object2X - 2].key == object1.key) {
            console.log('left 3 v2');
            return true;
        }


    }

    // если на одной высоте
    else if ((object1.position.y > object2.position.y && object1.position.y - object2.position.y <= spriteY && object1.position.x == object2.position.x) ||
        (object1.position.y < object2.position.y && object2.position.y - object1.position.y <= spriteY && object1.position.x == object2.position.x)) {
        object1Y = object1.position.y / spriteY;
        object1X = object1.position.x / spriteX;
        object2Y = object2.position.y / spriteY;
        object2X = object2.position.x / spriteX;
        console.clear();
        console.log('One y');
        if (object1X - 1 > 0 && object1X + 1 < newMap[0].length && object2X - 1 > 0 && object2X + 1 < newMap[0].length &&
            newMap[object2Y][object2X - 1].key == object1.key && newMap[object2Y][object2X + 1].key == object1.key) {
            return true;
        }
        if (object2Y - 1 > 0 && object2Y + 1 < newMap[0].length && object1X - 1 > 0 && object1X + 1 < newMap[0].length &&
            newMap[object1Y][object1X - 1].key == object1.key && newMap[object1Y][object1X + 1].key == object1.key) {
            return true;
        }
    }

    return false;
}

function check(key, x, y) {
    count = 0;
    if (!key || !y || y >= newMap.length) {
        return false;
    }
    element = newMap[y][x];
    if (element == 0 || newMap == undefined || element == undefined) {
        return false;
    }

    if ((y - 1 >= 0) && newMap[y - 1][x] != undefined && newMap[y - 1][x] != 0 && newMap[y - 1][x].key == key) {
        count++;
        if(check(key, x, y+1)) {
            count++;
        }
        bounce(y - 1, x, false, 2);
        deleteSprite(x, y);
        deleteSprite(x, y - 1);

        console.log(newMap);
    }
    // if ((y + 1 < newMap.length) && newMap[y + 1][x].key != undefined && newMap[y + 1][x].key == key) {
    //     count++;
    //     if(check(key, x, y+1)) {
    //         count++;
    //     }
    //     bounce(y + 1, x, false, 2);
    //     deleteSprite(x, y);
    //     deleteSprite(x, y + 1);
    //
    //     console.log(newMap);
    // }
    // if ((x + 1 < newMap[y].length) && newMap[y][x+1].key != undefined && newMap[y][x+1].key == key) {
    //     count++;
    //     if(check(key, x+1, y)) {
    //         count++;
    //     }
    //     bounce(y, x+1, true);
    //     deleteSprite(x, y);
    //     deleteSprite(x+1, y);
    //
    //     console.log(newMap);
    // }
    return count;
}

function deleteSprite(x, y) {
    game.add.tween(newMap[y][x]).to({alpha: 0}, 700, "Linear", true, 0);
    setTimeout(() => destroyed(x, y), 1200)
}

function destroyed(x, y) {
    newMap[y][x].destroy();
    newMap[y][x] = 0;
}

function bounce(posY, posX, x = false, heigth = 3) {
    if (x) {
        game.add.tween(newMap[posY - 1][posX]).to({y: newMap[posY][posX].position.y}, 500, "Linear", true, 300);
        setTimeout(function () {
            newY = newMap[posY - 1][posX].position.y;
            newY = newY / spriteY;
            newMap[newY][posX] = newMap[posY - 1][posX];
            newMap[posY - 1][posX] = 0;
        }, 1500);
        if (posY > 1) {
            bounce(posY - 1, posX, true, heigth);
        }
    } else {
        posY -= 1;
        if (posY >= 0 && posY <= newMap.length) {
            game.add.tween(newMap[posY][posX]).to({y: newMap[posY][posX].position.y + spriteY * heigth}, 500, "Linear", true, 300);
            setTimeout(function () {
                newY = newMap[posY][posX].position.y;
                newY = newY / spriteY;
                newMap[newY][posX] = newMap[posY][posX];
                newMap[posY][posX] = 0;
            }, 1500);
            bounce(posY, posX, heigth);
        }
    }

}


function update() {


}


function showText(txt, timeout) {
    text.setText(txt);
    setTimeout(function () {
        text.setText('');
    }, timeout);
}




