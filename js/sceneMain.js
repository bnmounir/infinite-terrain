// 1
class SceneMain extends Phaser.Scene {
    //2
    constructor() {
        super({ key: 'SceneMain' });
    }
    //3
    preload() {
        //
        this.load.spritesheet('sprWater', 'assets/sprWater.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('sprSand', 'assets/sprSand.png');
        this.load.image('sprGrass', 'assets/sprGrass.png');
    }
    //4
    create() {
        //\
        this.anims.create({
            key: 'sprWater',
            frames: this.anims.generateFrameNumbers('sprWater'),
            frameRate: 5,
            repeat: -1
        });
        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 10;
        //
        this.cameras.main.setZoom(2);
        //
        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x +
                this.cameras.main.worldView.width * 0.5,
            this.cameras.main.worldView.y +
                this.cameras.main.worldView.height * 0.5
        );
        this.chunk = [];

        this.keyW = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.keyS = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.keyA = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.keyD = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );
    }

    // 5
    getChunk(x, y) {
        //
        let chunk = null;

        for (let i = 0; i < this.chunk.length; i++) {
            if (this.chunk[i].x == x && this.chunk[i].y == y) {
                chunk = this.chunk[i];
            }
        }
        return chunk;
    }
    update() {
        //
        let snappedChunkX =
            this.chunkSize *
            this.tileSize *
            Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        let snappedChunkY =
            this.chunkSize *
            this.tileSize *
            Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));
        //
        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
        //
        for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                let existingChunk = this.getChunk(x, y);
                if (existingChunk == null) {
                    let newChunk = new Chunk(this, x, y);
                    this.chunk.push(newChunk);
                }
            }
        }
        //
        for (let i = 0; i < this.chunk.length; i++) {
            let chunk = this.chunk[i];
            if (
                Phaser.Math.Distance.Between(
                    snappedChunkX,
                    snappedChunkY,
                    chunk.x,
                    chunk.y
                ) < 3
            ) {
                if (chunk !== null) {
                    chunk.load();
                }
            } else {
                if (chunk !== null) chunk.unload();
            }
        }
        //
        if (this.keyW.isDown) this.followPoint.y -= this.cameraSpeed;
        if (this.keyS.isDown) this.followPoint.y += this.cameraSpeed;
        if (this.keyA.isDown) this.followPoint.x -= this.cameraSpeed;
        if (this.keyD.isDown) this.followPoint.x += this.cameraSpeed;
        //

        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }
}
