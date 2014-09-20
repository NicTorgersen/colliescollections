Crafty.scene('Game', function () {
    Crafty.audio.play('bg_music', -1, 0.2);
    this.occupied = new Array(Game.map_grid.width);

    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    // Place player character, occupy x = 5, y = 5 in grid
    this.player = Crafty.e('PlayerCharacter').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Trees, bushes and rocks
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
                          y == 0 || y == Game.map_grid.height - 2;

            if (at_edge) {
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.05 && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                Crafty.e('Bush').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.08 && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                Crafty.e('Rock').at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }
    console.log('Made ' + Crafty('Rock').length + ' rocks.');

    // Villages
    var max_villages = Crafty('Rock').length / 4;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < 0.02) {
                if (Crafty('Village').length < max_villages && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                    var currVillage = Crafty.e('Village').at(x, y).setCost(Math.ceil(Math.random() *  Crafty('Village').length * 0.85));
                    console.log('Generating village: #' + Crafty('Village').length);

                    // set the text component (current village cost) to current text component generated
                    var currVillageText = Crafty.e('VillageText').at(x, y - 1).text(currVillage._cost);
                    currVillage.setTextComponent(currVillageText);
                }
            }
        }
    }

    this.show_victory = this.bind('VillageVisited', function () {
        if (!Crafty('Village').length) {
            Crafty.scene('Victory');
        }
    });
}, function () {
    this.unbind('VillageVisited', this.show_victory);
});

// Tells the player she's won

// press any key to restart (binding event handler to keydown)
Crafty.scene('Victory', function () {
    Crafty.e('2D, DOM, Text')
        .text('All villages got their stuff!')
        .attr({
            x: 0,
            y: Game.height() / 2 - 38,
            w: Game.width()
        }).textFont({
            size: '24px',
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
    Crafty.e('2D, DOM, Text')
        .text('Loading game assets...')
        .attr({
            x: 0,
            y: Game.height() / 2 - 38,
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
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac',
        'assets/round_end.wav',
        'assets/candy_dish_lid.mp3',
        'assets/candy_dish_lid.ogg',
        'assets/candy_dish_lid.aac',
        'assets/pickup_gem.wav',
        'assets/background-music/8_bytes_unicorn_kid.mp3'], function () {
            Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
                spr_tree: [0, 0],
                spr_bush: [1, 0],
                spr_village: [0, 1],
                spr_rock: [1, 1]
            });

            Crafty.sprite(16, 'assets/hunter.png', {
                spr_player: [0, 2],
            }, 0, 2);

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
                bg_music: [
                    'assets/background-music/8_bytes_unicorn_kid.mp3'
                ]
            });

            Crafty.scene('Game');
        })
});