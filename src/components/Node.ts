import { List } from '../lang/List';
import { NodeConnector } from './NodeConnector';
import { Point } from '../geom/Point';
import { Unit } from '../model/Unit';
import { UnitConnector } from '../model/UnitConnector';

export class Node {

    public static TEXT_SIZE: number = 14;
    public static CONNECTOR_PADDING_TOP: number = 20;
    public static CONNECTOR_GAP: number = 5;
    public static CORNER_RADIUS: number = 20;

    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public color: string;
    public connectors: List<NodeConnector>;
    public unit: Unit;

    constructor(unit: Unit, color?: string) {
        this.unit = unit;
        this.color = color || "rgb(128,128,128)";
        this.x = this.y = 0;
        this.width = 150;
        this.height = 75;
        this.connectors = new List();

        let inputs: Array<UnitConnector> = this.unit.getConnectors(UnitConnector.INPUT);
        let outputs: Array<UnitConnector> = this.unit.getConnectors(UnitConnector.OUTPUT);
        let y: number;

        y = Node.CONNECTOR_PADDING_TOP;
        for (const input of inputs) {
            this.connectors.add(new NodeConnector(0, y, input));
            y += NodeConnector.RADIUS * 2 + Node.CONNECTOR_GAP;
        }

        y = Node.CONNECTOR_PADDING_TOP;
        for (const output of outputs) {
            this.connectors.add(new NodeConnector(this.width, y, output));
            y += NodeConnector.RADIUS * + Node.CONNECTOR_GAP;
        }
    }

    getLocation(): Point {
        return new Point(this.x, this.y);
    }

    findConnectorForUnitConnector(unitConnector: UnitConnector): NodeConnector | null {
        if (unitConnector) {
            for (const connector of this.connectors) {
                if (connector.unitConnector === unitConnector) {
                    return connector;
                }
            }
        }
        return null;
    }

    findConnectorForPoint(p: Point): NodeConnector | null {
        if (p) {
            for (const connector of this.connectors) {
                if (connector.contains(p)) {
                    return connector;
                }
            }
        }
        return null;
    }

    contains(p: Point): boolean {
        if (p) {
            p.translate(this.x, this.y);
            for (const connector of this.connectors) {
                if (connector.contains(p)) {
                    return true;
                }
            }
            p.translate(-this.x, -this.y);
            return p.x >= this.x && p.x < this.x + this.width
                && p.y >= this.y && p.y < this.y + this.height;
        }
        return false;
    }

    moveTo(p: Point) {
        if (p) {
            this.x = p.x;
            this.y = p.y;
        }
    }

    render(g: CanvasRenderingContext2D): void {
        g.shadowBlur = 20;
        g.shadowColor = '#000';
        g.fillRect(
            this.x + (Node.CORNER_RADIUS / 2),
            this.y + (Node.CORNER_RADIUS / 2),
            this.width - Node.CORNER_RADIUS,
            this.height - Node.CORNER_RADIUS);

        g.shadowBlur = 0;
        g.fillStyle = this.color || '#888';
        g.strokeStyle = this.color || '#888';

        g.lineJoin = 'round';
        g.lineWidth = Node.CORNER_RADIUS;

        g.strokeRect(
            this.x + (Node.CORNER_RADIUS / 2),
            this.y + (Node.CORNER_RADIUS / 2),
            this.width - Node.CORNER_RADIUS,
            this.height - Node.CORNER_RADIUS);
        g.fillRect(
            this.x + (Node.CORNER_RADIUS / 2),
            this.y + (Node.CORNER_RADIUS / 2),
            this.width - Node.CORNER_RADIUS,
            this.height - Node.CORNER_RADIUS);

        g.fillStyle = '#FFF';
        g.font = Node.TEXT_SIZE + "px Arial";
        g.fillText('Some text', this.x + NodeConnector.RADIUS + Node.CONNECTOR_GAP, this.y + Node.TEXT_SIZE + 10);

        g.translate(this.x, this.y);
        for (const connector of this.connectors) {
            this.renderConnector(g, connector);
        }
        g.translate(-this.x, -this.y);
    }

    renderConnector(g: CanvasRenderingContext2D, connector: NodeConnector): void {
        if (connector) {
            g.fillStyle = connector.color || '#FFF';
            g.beginPath();
            g.ellipse(connector.point.x, connector.point.y, NodeConnector.RADIUS, NodeConnector.RADIUS, 0, 0, 360);
            g.fill();
        }
    }
}