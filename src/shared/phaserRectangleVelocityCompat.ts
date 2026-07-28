import Phaser from 'phaser';

type PhysicsRectangle = Phaser.GameObjects.Rectangle & {
  body?: Phaser.Physics.Arcade.Body;
};

type RectanglePrototype = {
  setVelocity?: (x: number, y: number) => PhysicsRectangle;
};

const prototype = Phaser.GameObjects.Rectangle.prototype as unknown as RectanglePrototype;

if (typeof prototype.setVelocity !== 'function') {
  Object.defineProperty(prototype, 'setVelocity', {
    configurable: true,
    writable: true,
    value(this: PhysicsRectangle, x: number, y: number): PhysicsRectangle {
      const body = this.body;
      if (!body) throw new Error('Arcade body is missing on the invisible movement rectangle.');
      body.setVelocity(x, y);
      return this;
    },
  });
}
