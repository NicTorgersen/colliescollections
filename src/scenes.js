Crafty.scene('Game', function () {
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

    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 ||
                          y == 0 || y == Game.map_grid.height - 2;

            if (at_edge) {
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.06 && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                Crafty.e('Bush').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.09 && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                Crafty.e('Rock').at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }

    var max_villages = Game.map_grid.width + Game.map_grid.height;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < 0.02) {
                if (Crafty('Village').length < max_villages && !this.occupied[x][y] && y != Game.map_grid.height - 1) {
                    var currVillage = Crafty.e('Village').at(x, y);
                    console.log('Generating village: #' + Crafty('Village').length);

                    // set the text component (current village cost) to current text component generated
                    var currVillageText = Crafty.e('VillageText').at(x, y - 1).text(currVillage._cost);
                    currVillage.setTextComponent(currVillageText);
                }
            }
        }
    }

    Crafty.audio.play('ring');

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
            y: Game.height()/2 - 24,
            w: Game.width()
        })
        .css($text_css);

    Crafty.audio.play('applause');

    var delay = true;
    setTimeout(function() { delay = false; }, 2000);

    this.restart_game = this.bind('KeyDown', function () {
        if (!delay) {
            Crafty.scene('Game');
        }
    });
}, function () {
    this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Loading', function () {
    Crafty.e('2D, DOM, Text')
        .text('Loading, please wait...')
        .attr({
            x: 0,
            y: Game.height()/2 - 24,
            w: Game.width()
        })
        .css($text_css);

    // Once the image is loaded...
 
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite

    Crafty.load([
        'assets/16x16_forest_1.gif',
        'assets/hunter.png',
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac',
        'assets/board_room_applause.mp3',
        'assets/board_room_applause.ogg',
        'assets/board_room_applause.aac',
        'assets/candy_dish_lid.mp3',
        'assets/candy_dish_lid.ogg',
        'assets/candy_dish_lid.aac'], function () {
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
                applause: [
                    'assets/board_room_applause.mp3',
                    'assets/board_room_applause.ogg',
                    'assets/board_room_applause.aac'
                ],
                ring: [
                    'assets/candy_dish_lid.mp3',
                    'assets/candy_dish_lid.ogg',
                    'assets/candy_dish_lid.aac'
                ]
            });

            // When that's done, start game.
            Crafty.scene('Game');
        })
});