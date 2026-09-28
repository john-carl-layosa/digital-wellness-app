"use client";

import React, {
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  Move,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

const VIEWPORT_SIZE = 280;
const OUTPUT_SIZE = 512;

type Point = {
  x: number;
  y: number;
};

type Props = {
  src: string;
  onApply: (
    croppedImage: string
  ) => void;
  onCancel: () => void;
};

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

export function AvatarCropper({
  src,
  onApply,
  onCancel,
}: Props) {
  const imageRef =
    useRef<HTMLImageElement>(null);

  const dragRef = useRef<{
    pointerId: number;
    start: Point;
    origin: Point;
  } | null>(null);

  const [imageSize, setImageSize] =
    useState({
      width: 0,
      height: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [position, setPosition] =
    useState<Point>({
      x: 0,
      y: 0,
    });

  const metrics = useMemo(() => {
    if (
      !imageSize.width ||
      !imageSize.height
    ) {
      return {
        width: 0,
        height: 0,
        maxX: 0,
        maxY: 0,
        left: 0,
        top: 0,
      };
    }

    const coverScale = Math.max(
      VIEWPORT_SIZE / imageSize.width,
      VIEWPORT_SIZE / imageSize.height
    );

    const width =
      imageSize.width *
      coverScale *
      zoom;

    const height =
      imageSize.height *
      coverScale *
      zoom;

    return {
      width,
      height,

      maxX: Math.max(
        0,
        (width - VIEWPORT_SIZE) / 2
      ),

      maxY: Math.max(
        0,
        (height - VIEWPORT_SIZE) / 2
      ),

      left:
        (VIEWPORT_SIZE - width) / 2,

      top:
        (VIEWPORT_SIZE - height) / 2,
    };
  }, [imageSize, zoom]);

  const setClampedPosition = (
    next: Point
  ) => {
    setPosition({
      x: clamp(
        next.x,
        -metrics.maxX,
        metrics.maxX
      ),

      y: clamp(
        next.y,
        -metrics.maxY,
        metrics.maxY
      ),
    });
  };

  const changeZoom = (
    nextZoom: number
  ) => {
    setZoom(nextZoom);

    setPosition({
      x: 0,
      y: 0,
    });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    dragRef.current = {
      pointerId: event.pointerId,

      start: {
        x: event.clientX,
        y: event.clientY,
      },

      origin: position,
    };
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    setClampedPosition({
      x:
        drag.origin.x +
        event.clientX -
        drag.start.x,

      y:
        drag.origin.y +
        event.clientY -
        drag.start.y,
    });
  };

  const stopDragging = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      dragRef.current?.pointerId ===
      event.pointerId
    ) {
      dragRef.current = null;
    }
  };

  const applyCrop = () => {
    const image = imageRef.current;

    if (
      !image ||
      !metrics.width ||
      !metrics.height
    ) {
      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const outputScale =
      OUTPUT_SIZE / VIEWPORT_SIZE;

    context.clearRect(
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    context.save();
    context.beginPath();

    context.arc(
      OUTPUT_SIZE / 2,
      OUTPUT_SIZE / 2,
      OUTPUT_SIZE / 2,
      0,
      Math.PI * 2
    );

    context.closePath();
    context.clip();

    context.drawImage(
      image,

      (metrics.left + position.x) *
        outputScale,

      (metrics.top + position.y) *
        outputScale,

      metrics.width * outputScale,
      metrics.height * outputScale
    );

    context.restore();

    onApply(
      canvas.toDataURL(
        "image/webp",
        0.86
      )
    );
  };

  const resetCrop = () => {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="mt-4 rounded-2xl border border-line bg-canvasAlt p-4">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
        <div>
          <div
            role="application"
            aria-label="Circular profile photo crop area. Drag the image to reposition it."
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              stopDragging
            }
            onPointerCancel={
              stopDragging
            }
            className="relative cursor-grab touch-none overflow-hidden rounded-full border-4 border-white bg-plum-soft shadow-elevated active:cursor-grabbing"
            style={{
              width: VIEWPORT_SIZE,
              height: VIEWPORT_SIZE,
            }}
          >
            {/* A regular image is used because canvas needs its DOM element. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={src}
              alt="Profile crop preview"
              draggable={false}
              onLoad={(event) => {
                setImageSize({
                  width:
                    event.currentTarget
                      .naturalWidth,

                  height:
                    event.currentTarget
                      .naturalHeight,
                });

                setPosition({
                  x: 0,
                  y: 0,
                });
              }}
              className="pointer-events-none absolute max-w-none select-none"
              style={{
                width: metrics.width,
                height: metrics.height,

                transform: `translate(${
                  metrics.left + position.x
                }px, ${
                  metrics.top + position.y
                }px)`,

                transformOrigin:
                  "top left",
              }}
            />
          </div>

          <p className="mt-2 text-center text-xs text-inkSoft">
            Drag the photo to reposition it.
          </p>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4">
          <div>
            <label
              htmlFor="avatarZoom"
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <ZoomIn
                size={16}
                className="text-plum"
              />

              Zoom
            </label>

            <input
              id="avatarZoom"
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) =>
                changeZoom(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-2 w-full accent-[#6E4AA6]"
            />
          </div>

          <div>
            <label
              htmlFor="avatarHorizontal"
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <Move
                size={16}
                className="text-plum"
              />

              Horizontal position
            </label>

            <input
              id="avatarHorizontal"
              type="range"
              min={-metrics.maxX}
              max={metrics.maxX}
              step="1"
              value={clamp(
                position.x,
                -metrics.maxX,
                metrics.maxX
              )}
              disabled={
                metrics.maxX === 0
              }
              onChange={(event) =>
                setClampedPosition({
                  ...position,

                  x: Number(
                    event.target.value
                  ),
                })
              }
              className="mt-2 w-full accent-[#6E4AA6] disabled:opacity-40"
            />
          </div>

          <div>
            <label
              htmlFor="avatarVertical"
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <Move
                size={16}
                className="rotate-90 text-plum"
              />

              Vertical position
            </label>

            <input
              id="avatarVertical"
              type="range"
              min={-metrics.maxY}
              max={metrics.maxY}
              step="1"
              value={clamp(
                position.y,
                -metrics.maxY,
                metrics.maxY
              )}
              disabled={
                metrics.maxY === 0
              }
              onChange={(event) =>
                setClampedPosition({
                  ...position,

                  y: Number(
                    event.target.value
                  ),
                })
              }
              className="mt-2 w-full accent-[#6E4AA6] disabled:opacity-40"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <PrimaryButton
              type="button"
              onClick={applyCrop}
              icon={<Check size={16} />}
            >
              Apply Crop
            </PrimaryButton>

            <PrimaryButton
              type="button"
              variant="outline"
              onClick={resetCrop}
              icon={
                <RotateCcw size={16} />
              }
            >
              Reset
            </PrimaryButton>

            <PrimaryButton
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}