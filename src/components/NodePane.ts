import { Canvas } from './Canvas';
import { CanvasEvent } from './CanvasEvent';
import { List } from '../lang/List';
import { Node } from './Node';
import { NodeConnector } from './NodeConnector';
import { Point } from '../geom/Point';
import { Unit } from '../model/Unit';
import { UnitConnector } from '../model/UnitConnector';

export class NodePane
    extends Canvas {

    private nodes: List<Node>;
    private nodeHovered: Node | null = null;
    private nodeDragged: Node | null = null;
    private connectorHovered: NodeConnector | null = null;
    private connectorDragged: NodeConnector | null = null;
    private dragPoint: Point;
    private connectPoint: Point;
    private originPoint: Point;
    private isLinking: boolean = false;

    constructor(elm: HTMLCanvasElement) {
        super(elm);

        this.nodes = new List();
        this.dragPoint = new Point();
        this.originPoint = new Point();
        this.connectPoint = new Point();
    }

    addNode(node: Node): void {
        if (node) {
            this.nodes.add(node);
        }
    }

    getNodeForUnit(unit: Unit): Node | null {
        for (const node of this.nodes) {
            if (node.unit === unit) {
                return node;
            }
        }
        return null;
    }

    //
    // Rendering
    //
    paint(g: CanvasRenderingContext2D): void {
        let gradient = g.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#333');
        gradient.addColorStop(.5, '#444');
        gradient.addColorStop(1, '#333');


        g.fillStyle = gradient;
        g.fillRect(0, 0, this.width, this.height);

        if (this.nodes) {
            // render links
            for (const node of this.nodes) {
                for (const connector of node.connectors) {
                    let otherNode: Node | null = null;
                    let otherConnector: NodeConnector | null = null;

                    if (connector.unitConnector.connected) {
                        otherNode = this.getNodeForUnit(connector.unitConnector.connected.unit);
                    }
                    if (connector.unitConnector.connected && otherNode) {
                        otherConnector = otherNode.findConnectorForUnitConnector(connector.unitConnector.connected);
                    }
                    if (otherConnector && otherNode) {
                        this.paintLink(g, node, connector.color, connector.point, otherNode, otherConnector.color, otherConnector.point);
                    }
                }
            }

            if (this.isLinking) {
                if (this.nodeDragged && this.connectorDragged) {
                    if (this.nodeHovered && this.connectorHovered) {
                        this.paintLink(g,
                            this.nodeDragged, this.connectorDragged.color, this.connectorDragged.point,
                            this.nodeHovered, this.connectorHovered.color, this.connectorHovered.point);
                    } else {
                        this.paintLink(g,
                            this.nodeDragged, this.connectorDragged.color, this.connectorDragged.point,
                            null, '#FFF', this.connectPoint);

                    }
                }
            }

            // render nodes
            for (const node of this.nodes) {
                node.render(g);
            }
        }
    }

    paintLink(g: CanvasRenderingContext2D, nA: Node, cA: string, pA: Point, nB: Node | null, cB: string, pB: Point): void {
        let pS = new Point(pA); // start point
        let pE = new Point(pB); // end point

        if (nA != null) {
            let pNA = nA.getLocation();
            pS.translate(-pNA.x, -pNA.y);
        }
        if (nB != null) {
            let pNB = nB.getLocation();
            pE.translate(-pNB.x, -pNB.y);
        }

        let pC = new Point( // bezier control point
            pS.x + (pE.x - pS.x) / 2,
            pS.y + (pE.y - pS.y) / 2
        );

        let gradient = g.createLinearGradient(pS.x, pS.y, pE.x, pE.y);
        gradient.addColorStop(0, cA);
        gradient.addColorStop(1, cB);

        g.strokeStyle = gradient;//"rgb(200,0,0)";
        g.beginPath();
        g.lineWidth = 3;
        g.moveTo(pS.x, pS.y);
        g.bezierCurveTo(pC.x, pS.y, pC.x, pE.y, pE.x, pE.y);
        g.stroke();

        if (nB === null) {
            g.fillStyle = cB;
            g.beginPath();
            g.ellipse(pB.x, pB.y, NodeConnector.RADIUS, NodeConnector.RADIUS, 0, 0, 360);
            g.fill();
        }
    }

    //
    // Event handling
    //
    processMouseEvent(e: CanvasEvent): void {
        if (e.id === CanvasEvent.MOUSE_PRESSED) {
            if (this.nodeHovered) {
                this.nodeDragged = this.nodeHovered;
                this.connectorDragged = this.connectorHovered;
                this.originPoint.setLocation(this.nodeDragged.x, this.nodeDragged.y);
            }

            this.dragPoint.setLocationPoint(e.point);
        } else if (e.id === CanvasEvent.MOUSE_RELEASED) {
            if (this.connectorDragged && this.connectorHovered) {
                this.connectorDragged.unitConnector.linkTo(this.connectorHovered.unitConnector);
            }
            this.nodeDragged = null;
            this.connectorDragged = null;
            this.isLinking = false;
        }
    }

    processMouseMotionEvent(e: CanvasEvent): void {
        this.nodeHovered = null;
        this.connectorHovered = null;

        for (let i = this.nodes.size() - 1; i >= 0; i--) {
            let node: Node = this.nodes.get(i);

            if (node && node.contains(e.point)) {
                this.nodeHovered = node;
                this.connectorHovered = this.nodeHovered.findConnectorForPoint(e.point);
                break;
            }
        }
        if (e.id === CanvasEvent.MOUSE_DRAGGED) {
            if (this.nodeDragged) {
                if (this.connectorDragged) {
                    this.isLinking = true;
                } else {
                    this.originPoint.x += e.point.x - this.dragPoint.x;
                    this.originPoint.y += e.point.y - this.dragPoint.y;

                    this.nodeDragged.moveTo(this.originPoint);
                }
            }
            this.dragPoint.setLocationPoint(e.point);
        }

        this.connectPoint.setLocationPoint(e.point);
    }
}
