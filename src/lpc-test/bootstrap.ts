import Phaser from 'phaser';

type VelocityRectangle = Phaser.GameObjects.Rectangle & {
  setVelocity: (x: number, y: number) => VelocityRectangle;
};

const rectanglePrototype = Phaser.GameObjects.Rectangle.prototype as unknown as Partial<VelocityRectangle>;
if (typeof rectanglePrototype.setVelocity !== 'function') {
  Object.defineProperty(rectanglePrototype, 'setVelocity', {
    configurable: true,
    value(this: Phaser.GameObjects.Rectangle, x: number, y: number): VelocityRectangle {
      const body = this.body as Phaser.Physics.Arcade.Body | undefined;
      body?.setVelocity(x, y);
      return this as VelocityRectangle;
    },
  });
}

await import('./main');
