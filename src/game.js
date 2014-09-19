var uiPouch = {
    rocks: document.getElementById('player-rocks')
};

Game = {
    // define size of grid and corresponding tiles
    map_grid: {
        width: 32,
        height: 16,
        tile: {
            width: 16,
            height: 16
        }
    },

    uiPouch: uiPouch,

    // total width of game screen
    width: function () {
        return this.map_grid.width * this.map_grid.tile.width;
    },
    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    start: function () {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(87, 109, 20)');

        // Start game scene
        Crafty.scene('Loading');
    }
}

$text_css = {
    'size': '24px',
    'family': 'Arial',
    'color': 'white',
    'text-align': 'center'
}