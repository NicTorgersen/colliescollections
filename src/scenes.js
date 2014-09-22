Crafty.scene('Game', function () {
    //Crafty.audio.play('bg_music_2', -1, 0.2);
    Crafty.background('rgb(87, 109, 20)');
    this.occupied = new Array(Game.map_grid.width);

    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    // Place player character, occupy x = 5, y = 5 in grid
    var pPos = {x: Math.ceil(Math.random() * (Game.map_grid.width - 2)), y: Math.ceil(Math.random() * (Game.map_grid.height - 3)) };
    this.occupied[pPos.x][pPos.y] = true;

    // Trees, bushes and rocks
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
                          y == 0 || y == Game.map_grid.height - 2;

            if (at_edge) {
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if ( Math.random() < 0.3 &&
                        !this.occupied[x][y] && 
                        !this.occupied[x+1][y] &&
                        !this.occupied[x][y+1] &&
                        !this.occupied[x-1][y] &&
                        !this.occupied[x][y-1] &&
                        !this.occupied[x+1][y+1] &&
                        !this.occupied[x-1][y+1] &&
                        !this.occupied[x-1][y-1] &&
                        !this.occupied[x+1][y-1] &&
                        y != Game.map_grid.height - 1
            ) {
                Crafty.e('Bush').at(x, y);
                this.occupied[x][y] = true;
                this.occupied[x+1][y] = true;
                this.occupied[x][y+1] = true;
                this.occupied[x-1][y] = true;
                this.occupied[x][y-1]  = true;
            } else if (Math.random() < 0.09 && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                Crafty.e('Rock').at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }
    console.log('Made ' + Crafty('Rock').length + ' rocks.');

    // Villages
    var max_villages = Crafty('Rock').length / 4;
    var max_tools    = {
        reg_Axe: 1
    };
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < 0.02) {
                if (Crafty('Village').length < max_villages && !this.occupied[x][y] && y != Game.map_grid.height - 1) {

                    var currVillage = Crafty.e('Village').at(x, y);
                    console.log('Generating village: #' + Crafty('Village').length);

                    var returnNonOccupied = function (x, y, array) {
                        if (!array[x+1][y]) {
                            return { x: x+1, y: y };
                        }
                        if (!array[x-1][y]) {
                            return { x: x-1, y: y };
                        }
                        /*if (!array[x][y+1]) {
                            return { x: x, y: y+1 };
                        }
                        if (!array[x][y-1]) {
                            return { x: x, y: y-1 };
                        }*/
                        return false;
                    };
                    if ((Crafty('reg_Axe').length < max_tools['reg_Axe'] &&
                        currVillage._cost > 4) &&
                        (!this.occupied[x+1][y] ||
                        !this.occupied[x][y+1]) /*||
                        !this.occupied[x-1][y] ||
                        !this.occupied[x][y-1]*/) {
                        var nonOccupieds = returnNonOccupied(x, y, this.occupied);

                        if (nonOccupieds != false) {
                            currTool = Crafty.e('reg_Axe').at(nonOccupieds.x, nonOccupieds.y);
                            currToolText = Crafty.e('ToolText').at(nonOccupieds.x, nonOccupieds.y - 1)
                                            .text(currTool._toolName);
                            currTool.setTextComponent(currToolText);
                            console.log('Number of axes so far: ' + Crafty('reg_Axe').length);
                            currVillage.setToolComponent(currTool)
                                        .setTextComponent(currToolText);
                        }

                    }

                    // set the text component (current village cost) to current text component generated
                    var currVillageText = Crafty.e('VillageText').at(x, y - 1).text(currVillage._cost);
                    currVillage.setTextComponent(currVillageText);
                }
            }
        }
    }

    this.player = Crafty.e('PlayerCharacter').at(pPos.x, pPos.y);

    console.log(this.player.at().x);
    console.log(this.player.at().y);

    this.rockCounter = Crafty.e('PlayerRockCount').at(1, Game.map_grid.height - 1);
    this.update_rock_count = this.bind('RocksChanged', function (pc) {
        this.rockCounter.updateRockCount(pc);
    });

    this.show_victory = this.bind('VillageVisited', function () {
        if (!Crafty('Village').length) {
            Crafty.scene('Victory');
        }
    });
}, function () {
    this.unbind('RocksChanged', this.rockCounter);
    this.unbind('VillageVisited', this.show_victory);
});

// Tells the player she's won

// press any key to restart (binding event handler to keydown)
Crafty.scene('Victory', function () {
    Crafty.background('rgb(229, 201, 134)');
    Crafty.e('2D, DOM, Text')
        .text('all villages got their stuff')
        .attr({
            x: 0,
            y: Game.height() / 2 - 50,
            w: Game.width()
        }).textFont({
            size: '50px',
            font: 'Arial',
            weight: 'bold'
        })
        .textColor('white');

    Crafty.audio.play('victory');

    var delay = true;
    setTimeout(function() { delay = false; }, 2000);

    this.restart_game = this.bind('KeyDown', function () {
        if (!delay) {
            Crafty.audio.remove();
            Crafty.scene('Game');
        }
    });
}, function () {
    this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Loading', function () {
    Crafty.background('rgb(53, 117, 144)');
    Crafty.e('2D, DOM, Text')
        .text('Loading game assets...')
        .attr({
            x: 0,
            y: Game.height() / 2 - 24,
            w: Game.width()
        })
        .textFont({
            size: '24px',
            font: 'Arial',
            weight: 'bold'
        })
        .textColor('white');

    Crafty.load([
        'assets/16x16_forest_1.gif',
        'assets/hunter.png',
        'assets/items/tools/w_axe_hand.png',
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac',
        'assets/round_end.wav',
        'assets/candy_dish_lid.mp3',
        'assets/candy_dish_lid.ogg',
        'assets/candy_dish_lid.aac',
        'assets/pickup_gem.wav',
        'assets/pickup_axe.wav',
        'assets/pickup_axe.mp3',
        'assets/background-music/8_bytes_unicorn_kid.mp3',
        'assets/background-music/8_bit_deadmau5.mp3'], function () {
            Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
                spr_tree: [0, 0],
                spr_bush: [1, 0],
                spr_village: [0, 1],
                spr_rock: [1, 1]
            });

            Crafty.sprite(16, 'assets/hunter.png', {
                spr_player: [0, 2],
            }, 0, 2);

            Crafty.sprite(16, 'assets/items/tools/w_axe_hand.png', {
                spr_reg_axe: [0, 0]
            });

            Crafty.audio.add({
                knock: [
                    'assets/door_knock_3x.mp3',
                    'assets/door_knock_3x.ogg',
                    'assets/door_knock_3x.aac'
                ],
                victory: [
                    'assets/round_end.wav'
                ],
                gem: [
                    'assets/pickup_gem.wav'
                ],
                axe: [
                    'assets/pickup_axe.wav',
                    'assets/pickup_axe.mp3'
                ],
                bg_music_1: [
                    'assets/background-music/8_bytes_unicorn_kid.mp3'
                ],
                bg_music_2: [
                    'assets/background-music/8_bit_deadmau5.mp3'
                ]
            });

            Crafty.scene('Game');
        })
});