import { CanvasEvent } from './CanvasEvent';

export class Canvas {

    public width: number = 0;
    public height: number = 0;
    private element: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isMousePressed: boolean = false;;

    constructor(element: HTMLCanvasElement) {
        this.element = element;
        this.ctx = this.element.getContext('2d') as CanvasRenderingContext2D;

        window.addEventListener('resize', e => { this.resize() });
        window.addEventListener('mousemove', this.dispatch.bind(this));
        window.addEventListener('mousedown', this.dispatch.bind(this));
        window.addEventListener('mouseup', this.dispatch.bind(this));
        // window.addEventListener('click', this.dispatch.bind(this));

        this.resize();
        this.loop();
    }

    dispatch(event: any): void {
        // console.log(event);
        if (event instanceof MouseEvent) {
            this.dispatchMouseEvent(event as MouseEvent);
        }
    }

    dispatchMouseEvent(event: MouseEvent): void {
        let cEvent: CanvasEvent = new CanvasEvent();
        let bounds = this.element.getBoundingClientRect();

        cEvent.point.setLocation(
            event.clientX - bounds.left,
            event.clientY - bounds.top
        );

        switch (event.type) {
            case 'mousedown':
                cEvent.id = CanvasEvent.MOUSE_PRESSED;
                this.isMousePressed = true;
                this.processMouseEvent(cEvent);
                break;
            case 'mouseup':
                cEvent.id = CanvasEvent.MOUSE_RELEASED;
                this.isMousePressed = false;
                this.processMouseEvent(cEvent);
                break;
            case 'mousemove':
                if (this.isMousePressed) {
                    cEvent.id = CanvasEvent.MOUSE_DRAGGED;
                } else {
                    cEvent.id = CanvasEvent.MOUSE_MOVED;
                }
                this.processMouseMotionEvent(cEvent);
                break;
        }
    }

    resize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.setAttribute('width', '' + this.width);
        this.element.setAttribute('height', '' + this.height);

        this.repaint();
    }

    loop(): void {
        requestAnimationFrame(this.loop.bind(this));

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.repaint();
    }

    repaint(): void {
        this.paint(this.ctx);
    }

    paint(g: CanvasRenderingContext2D): void { }
    processMouseEvent(e: CanvasEvent): void { }
    processMouseMotionEvent(e: CanvasEvent): void { }
}