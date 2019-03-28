// 1
class Chunk {
    constructor(scene, x, y) {
        // 2
        this.scene = scene;
        this.x = x;
        this.y = y;
        // 3
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
    }

    // 4 check if chunk is loaded, if so, remove all the tiles from the group and set set state "isLoaded" to false for that chunk
    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);

            this.isLoaded = false;
        }
    }

    // 5
    load() {
        // 6
        if (!this.isLoaded) {
            // 7 iterate through X and Y tile position in the chunk
            for (let x = 0; x < this.scene.chunkSize; x++) {
                for (let y = 0; y < this.scene.chunkSize; y++) {
                    let tileX =
                        this.x * (this.scene.chunkSize * this.scene.tileSize) +
                        x * this.scene.tileSize;
                    let tileY =
                        this.y * (this.scene.chunkSize * this.scene.tileSize) +
                        y * this.scene.tileSize;

                    // 9 generate perline noise
                    let perlineValue = noise.perlin2(tileX / 100, tileY / 100);

                    // 10 define image and animation key
                    let key = '';
                    let animationKey = '';

                    // 11 check decimal (within -1...1) ranges to determine what tile we want to create
                    if (perlineValue < 0.2) {
                        key = 'sprWater';
                        animationKey = 'sprWater';
                    } else if (perlineValue >= 0.2 && perlineValue < 0.3) {
                        key = 'sprSand';
                    } else {
                        key = 'sprGrass';
                    }

                    // 12
                    let tile = new Tile(this.scene, tileX, tileY, key);

                    // 13 play animation if we have one
                    if (animationKey !== '') tile.play(animationKey);

                    // 14
                    this.tiles.add(tile);
                }
            }

            // 15 mark chunk as loaded
            this.isLoaded = true;
        }
    }
}

// 16
class Tile extends Phaser.GameObjects.Sprite {
    // 17
    constructor(scene, x, y, key) {
        // 18
        super(scene, x, y, key);
        this.scene = scene;
        // 19
        this.scene.add.existing(this);
        // 20
        this.setOrigin(0); // we have to type the first parameter if we want to apply value for both X and Y
    }
}
