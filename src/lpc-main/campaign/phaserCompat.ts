import Phaser from 'phaser';

type ExtendedGraphics = Phaser.GameObjects.Graphics & {
  quadraticBezierTo: (controlX: number, controlY: number, x: number, y: number) => ExtendedGraphics;
};

const graphicsPrototype = Phaser.GameObjects.Graphics.prototype as unknown as Partial<ExtendedGraphics>;
if (typeof graphicsPrototype.quadraticBezierTo !== 'function') {
  Object.defineProperty(graphicsPrototype, 'quadraticBezierTo', {
    configurable: true,
    value(this: Phaser.GameObjects.Graphics, _controlX: number, _controlY: number, x: number, y: number): ExtendedGraphics {
      this.lineTo(x, y);
      return this as ExtendedGraphics;
    },
  });
}

const cameraPrototype = Phaser.Cameras.Scene2D.Camera.prototype as Phaser.Cameras.Scene2D.Camera & { rotation?: number };
if (!Object.prototype.hasOwnProperty.call(cameraPrototype, 'rotation')) {
  Object.defineProperty(cameraPrototype, 'rotation', { configurable: true, writable: true, value: 0 });
}

const geom = Phaser.Geom as typeof Phaser.Geom & { Point?: typeof Phaser.Math.Vector2 };
if (!geom.Point) {
  geom.Point = class Point extends Phaser.Math.Vector2 {
    constructor(x: number, y: number) { super(x, y); }
  };
}
