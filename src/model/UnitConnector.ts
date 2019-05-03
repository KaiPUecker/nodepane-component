import { Unit } from "./Unit";

export class UnitConnector {

    public static INPUT: number = 1;
    public static OUTPUT: number = 2;

    public type: number;
    public connected: UnitConnector | null = null;
    public unit: Unit;

    constructor(unit: Unit, type: number) {
        this.unit = unit;
        this.type = type;
    }

    linkTo(otherConnector: UnitConnector) {
        if (otherConnector) {
            this.connected = otherConnector;
            otherConnector.connected = this;
        }
    }
}