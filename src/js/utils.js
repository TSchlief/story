import { displaySize } from "./config.js"


export function globalToLocalPosition(position) {
    console.log(position)
    const x = position.x - (displaySize.x / 2);
    const y = position.y - (displaySize.y / 2);
    return {x, y};
}