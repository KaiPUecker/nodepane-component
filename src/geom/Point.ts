export class Point {
    public x: number = 0;
    public y: number = 0;

    constructor(xOrPoint?: number | Point, y?: number) {
        if (xOrPoint instanceof Point) {
            let p: Point = xOrPoint as Point;
            this.x = p.x;
            this.y = p.y;
        } else {
            this.x = (xOrPoint as number) || 0;
            this.y = y || 0;
        }
    }

    distanceTo(p: Point): number {
        if (p) {
            return Math.sqrt((p.y - this.y) * (p.y - this.y) + (p.x - this.x) * (p.x - this.x));
        }
        return NaN;
    }

    translate(xDeltaOrPoint: number | Point, yDelta?: number): void {
        if (xDeltaOrPoint instanceof Point) {
            let p: Point = xDeltaOrPoint as Point;
            this.x -= p.x;
            this.y -= p.y;
        } else {
            this.x -= xDeltaOrPoint as number;
            this.y -= yDelta || 0;
        }
    }

    setLocationPoint(p: Point): void {
        if (p) {
            this.setLocation(p.x, p.y);
        }
    }

    setLocation(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}