// The Grid component allows an element to be located
//  on a grid of tiles

Crafty.c('Grid', {
    init: function () {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // locate _this_ entity at the given position on the grid
    at: function (x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x/Game.map_grid.tile.width,
                y: this.y/Game.map_grid.tile.height
            }
        } else {
            this.attr({
                x: x * Game.map_grid.tile.width,
                y: y * Game.map_grid.tile.height
            });

            return this;
        }
    }
});

// Entity drawn in 2D on canvas
// via logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas, Grid');
    },
});

Crafty.c('Tree', {
    init: function () {
        this.requires('Actor, Solid, spr_tree');
    },
});

Crafty.c('Bush', {
    init: function () {
        this.requires('Actor, Solid, spr_bush');
    },
});

Crafty.c('TestPlaceDetection', {
    init: function () {
        this.requires('2D, Canvas, Color, Grid');
    }
});

Crafty.c('Rock', {
    _hitpoints: 35,
    init: function () {
        this.requires('Actor, Solid, spr_rock');
    },

    breakStep: function (pc) {
        if (this._hitpoints == 0) {
            this.destroy();
            Crafty.audio.play('gem');
            pc.add('rocks', 1);
            var rock_loc = pc.get('rocks') == 1 ? 'rock' : 'rocks';
            console.log('You now have ' + pc.get('rocks') + ' ' + rock_loc + ' on hand.');
            return this;
        }
        this._hitpoints--;
        return this;
    }
})

Crafty.c('PlayerCharacter', {
    // currency
    _pouch: {
        'rocks': 0
    },
    add: function (item, amount) {
        if (amount > 0) {
            this._pouch[item] += amount;
            return this._pouch[item];
        }
        return;
    },
    deplete: function (item, amount) {
        if (amount <= this._pouch[item]) {
            this._pouch[item] -= amount;
            return this._pouch[item];
        }
        return;
    },
    get: function (item) {
        return this._pouch[item];
    },

    init: function () {
        this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
            .fourway(1.3)
            .onHit('Rock', this.breakRock)
            .onHit('Village', this.visitVillage)
            .stopOnSolids()

            // These next lines define our four animations
            //  each call to .animate specifies:
            //  - the name of the animation
            //  - the x and y coordinates within the sprite
            //     map at which the animation set begins
            //  - the number of animation frames *in addition to* the first one

            .reel('PlayerMovingUp',     600, 0, 0, 3)
            .reel('PlayerMovingRight',  600, 0, 1, 3)
            .reel('PlayerMovingDown',   600, 0, 2, 3)
            .reel('PlayerMovingLeft',   600, 0, 3, 3);

        var animation_speed = 4;
        this.bind('NewDirection', function (data) {
            if (data.x > 0) {
                this.animate('PlayerMovingRight', animation_speed, -1);
            } else if (data.x < 0) {
                this.animate('PlayerMovingLeft', animation_speed, -1);
            } else if (data.y > 0) {
                this.animate('PlayerMovingDown', animation_speed, -1);
            } else if (data.y < 0) {
                this.animate('PlayerMovingUp', animation_speed, -1);
            } else {
                this.pauseAnimation();
            }
        });
    },

    stopOnSolids: function () {
        this.onHit('Solid', this.stopMovement);

        return this;
    },

    stopMovement: function () {
        
        if (this._movement) {
            this.x -= this._movement.x;
        }
        if (this.hit('Solid') != false) {
            this.x += this._movement.x;
            this.y -= this._movement.y;
        }
        if (this.hit('Solid') != false) {
            this.x -= this._movement.x;
        }

        this._speed = 0;
    },

    visitVillage: function (data) {
        village = data[0].obj;
        village.visit(this);
    },

    breakRock: function (data) {
        rock = data[0].obj;
        this.stopMovement();
        rock.breakStep(this);
    }
});

Crafty.c('VillageText', {
    init: function () {
        this.requires('2D, DOM, Text, Grid');
    },
    villageDestroy: function () {
        this.destroy();
    }
})

Crafty.c('Village', {
    _cost: 0,
    _textComponent: '',
    setTextComponent: function (component) {
        this._textComponent = component;
        return this;
    },
    init: function () {
        this.requires('Actor, spr_village');
        this._cost = Math.ceil(Math.random() * 4) + 2;
        return this;
    },

    visit: function (pc) {
        if (pc.get('rocks') >= this._cost) {
            this.destroy();
            this._textComponent.villageDestroy();
            Crafty.audio.play('knock');
            Crafty.trigger('VillageVisited', this);

            pc.deplete('rocks', this._cost);
            console.log('You now have ' + pc.get('rocks') + ' rocks on hand.');
            return this;
        } else {
            return this;
        }
    }
})