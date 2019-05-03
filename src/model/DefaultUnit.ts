import { Unit } from "./Unit";
import { UnitConnector } from "./UnitConnector";

export class DefaultUnit
    extends Unit {

    public static INPUT: string = 'input';
    public static OUTPUT: string = 'output';

    constructor() {
        super();

        this.connectors.set(DefaultUnit.INPUT, new UnitConnector(this, UnitConnector.INPUT));
        this.connectors.set(DefaultUnit.OUTPUT, new UnitConnector(this, UnitConnector.OUTPUT));
    }
}