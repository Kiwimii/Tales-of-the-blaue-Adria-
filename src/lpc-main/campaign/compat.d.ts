declare namespace Phaser.GameObjects {
  interface Graphics {
    quadraticBezierTo(controlX: number, controlY: number, x: number, y: number): this;
  }
}

declare namespace Phaser.Cameras.Scene2D {
  interface Camera {
    rotation: number;
  }
}

declare namespace Phaser.Geom {
  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }
}

interface Set<T> {
  delete(value: T): void;
}
