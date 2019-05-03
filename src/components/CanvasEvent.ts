import { Point } from "../geom/Point";

export class CanvasEvent {

    static MOUSE_MOVED: number = 1;
    static MOUSE_DRAGGED: number = 2;
    static MOUSE_RELEASED: number = 3;
    static MOUSE_PRESSED: number = 4;

    public point: Point = new Point();
    public id: number = 0;

    constructor() { }
}