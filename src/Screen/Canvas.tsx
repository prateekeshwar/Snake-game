import React, {forwardRef, useEffect} from "react";
import "./Onboard.css";

type Props = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
> & {
  draw: (context: CanvasRenderingContext2D) => void;
};

const Canvas = forwardRef<HTMLCanvasElement, Props>(({ draw, ...props }, canvasRef) => {

    useEffect(() => {

        if (!canvasRef) {
            return
        }

        const canvas = (canvasRef as React.RefObject<HTMLCanvasElement>).current

        if (!canvas) {
            return
        }

        const context = canvas.getContext('2d')

        if (!context) {
            return
        }

        draw(context);

        return () => context.clearRect(0, 0, window.innerWidth, 600)

    }, [draw, canvasRef])

    if (!canvasRef) {
        return null;
    }

    return (
        <canvas className="game-board" ref={canvasRef} {...props} height={500} width={600} />
    )
});

export default Canvas;
