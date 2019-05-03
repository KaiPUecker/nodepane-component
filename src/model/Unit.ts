import { List } from "../lang/List";
import { UnitConnector } from "./UnitConnector";

export class Unit {

    protected connectors: Map<string, UnitConnector>;

    constructor() {
        this.connectors = new Map();
    }

    linkTo(thisId: string, otherUnit: Unit, otherId: string) {
        if (thisId && otherUnit && otherId) {
            let thisConnector: UnitConnector | undefined = this.getConnectorForID(thisId);
            let otherConnector: UnitConnector | undefined = otherUnit.getConnectorForID(otherId);
            if (thisConnector && otherConnector) {
                thisConnector.linkTo(otherConnector);
            }
        }
    }

    addConnector(id: string, unitConnection: UnitConnector): void {
        if (id && unitConnection) {
            this.connectors.set(id, unitConnection);
        }
    }

    getConnectorForID(id: string): UnitConnector | undefined {
        if (id && this.connectors.has(id)) {
            return this.connectors.get(id);
        }
        return undefined;
    }
    getConnectors(connectionType: number): Array<UnitConnector> {
        let arr: Array<UnitConnector> = [];

        for (const [id, connector] of this.connectors) {
            if (connector.type === connectionType) {
                arr.push(connector);
            }
        }

        return arr;
    }
}