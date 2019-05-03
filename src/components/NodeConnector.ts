import { Point } from "../geom/Point";
import { UnitConnector } from "../model/UnitConnector";

export class NodeConnector {

    public static RADIUS: number = 6;

    public point: Point;
    public unitConnector: UnitConnector;
    public color: string;

    constructor(x: number, y: number, unitConnector: UnitConnector) {
        this.point = new Point();
        this.point.x = x || 0;
        this.point.y = y || 0;
        this.color = UnitConnector.INPUT === unitConnector.type ? '#0F0' : '#F00';
        this.unitConnector = unitConnector;
    }

    contains(p: Point): boolean {
        return p && this.point.distanceTo(p) < NodeConnector.RADIUS;
    }
}