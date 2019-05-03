import { DefaultUnit } from './model/DefaultUnit';
import { Node } from './components/Node';
import { NodePane } from './components/NodePane';
import { Unit } from './model/Unit';

class App {
    static init() {
        document.addEventListener('DOMContentLoaded', () => { new App() }, false);
    }

    private app: HTMLElement;
    private canvas: HTMLCanvasElement;
    private nodePane: NodePane;

    constructor() {
        let unitA: DefaultUnit = new DefaultUnit();
        let unitB: DefaultUnit = new DefaultUnit();
        let unitC: DefaultUnit = new DefaultUnit();
        unitA.linkTo(DefaultUnit.OUTPUT, unitB, DefaultUnit.INPUT);
        unitB.linkTo(DefaultUnit.OUTPUT, unitC, DefaultUnit.INPUT);

        this.app = document.getElementById("app") as HTMLElement;
        this.canvas = document.getElementById("app__canvas") as HTMLCanvasElement;
        this.nodePane = new NodePane(this.canvas);
        this.nodePane.addNode(new Node(unitA));
        this.nodePane.addNode(new Node(unitB));
        this.nodePane.addNode(new Node(unitC));
    }
}


App.init();