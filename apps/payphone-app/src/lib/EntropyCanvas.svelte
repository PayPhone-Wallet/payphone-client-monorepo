<script lang="ts">
  import { onMount } from 'svelte'

  export let entropy = 0n

  const strokeWidth = 5
  const smoothing = 0.5
  const strokeStyle = 'black'

  let canvas: HTMLCanvasElement | undefined
  let x = 0
  let y = 0
  let drawing = false

  const onPointerDown = (e: PointerEvent) => {
    drawing = true
    x = e.offsetX
    y = e.offsetY
    drawDot(x, y)
    addEntropy(x, y)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || drawing) {
      const x2 = x + (e.offsetX - x) * smoothing
      const y2 = y + (e.offsetY - y) * smoothing
      drawLine(x2, y2)
      x = x2
      y = y2
      addEntropy(x, y)
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || drawing) {
      drawLine(e.offsetX, e.offsetY)
      x = e.offsetX
      y = e.offsetY
      addEntropy(x, y)
    }
    drawing = false
  }

  const drawDot = (x: number, y: number) => {
    const ctx = getCtx()
    ctx.moveTo(x, y)
    ctx.ellipse(x, y, strokeWidth / 2, strokeWidth / 2, Math.PI, 0, Math.PI)
    ctx.fill()
  }

  const drawLine = (x2: number, y2: number) => {
    const ctx = getCtx()
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  const getCtx = (): CanvasRenderingContext2D => {
    const ctx = canvas?.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2D rendering context...')
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = strokeStyle
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    return ctx
  }

  const addEntropy = (x: number, y: number) => {
    const xBig = BigInt(Math.floor(x)) * 10n ** 9n + BigInt(Math.floor((x % 1) * 10 ** 9)) // x shifted 9 decimal places
    const yBig = BigInt(Math.floor(y)) * 10n ** 9n + BigInt(Math.floor((y % 1) * 10 ** 9)) // y shifted 9 decimal places
    const maxUint256 = 2n ** 256n - 1n
    entropy = ((entropy + xBig) << 3n) & maxUint256
    entropy = ((entropy + yBig) << 3n) & maxUint256
  }

  onMount(() => {
    if (canvas && canvas.parentElement) {
      const bb = canvas.parentElement.getBoundingClientRect()
      canvas.width = bb.width
      canvas.height = bb.height
    }
  })
</script>

<!-- TODO: need delete/erase button to restart drawing (make sure to set entropy to 0n) -->

<div id="canvas-container">
  <canvas
    bind:this={canvas}
    on:pointerdown|preventDefault|stopPropagation={onPointerDown}
    on:pointermove|preventDefault|stopPropagation={onPointerMove}
    on:pointerup|preventDefault|stopPropagation={onPointerUp}
    on:pointerleave|preventDefault|stopPropagation={onPointerUp}
    on:touchstart|preventDefault|stopPropagation
    on:touchmove|preventDefault|stopPropagation
  />
</div>

<style>
  #canvas-container {
    position: relative;
    width: min(40em, 80%);
    aspect-ratio: 16/9;
    background-color: var(--green-50);
    border-radius: 0.5rem;
    margin: 0.75em 0;
    overflow: hidden;
  }

  canvas {
    min-width: 100%;
    min-height: 100%;
  }
</style>
