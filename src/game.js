Game = {
    // define size of grid and corresponding tiles
    map_grid: {
        width: 38,
        height: 20,
        tile: {
            width: 16,
            height: 16
        }
    },

    // total width of game screen
    width: function () {
        return this.map_grid.width * this.map_grid.tile.width;
    },
    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    start: function () {
        Crafty.init(Game.width(), Game.height());

        // Start game scene
        Crafty.scene('Loading');
    }
}