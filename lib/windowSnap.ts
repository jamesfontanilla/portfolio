import type { WindowAction, WindowState } from '@/store/windowManagerStore';

export type SnapTarget =
  | 'maximize'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface SnapViewport {
  viewportWidth: number;
  viewportHeight: number;
  dockHeight: number;
}

export interface SnapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapPreviewState {
  target: SnapTarget;
  rect: SnapRect;
}

export interface SnapLayoutOption {
  target: SnapTarget;
  label: string;
  description: string;
}

export const SNAP_TRIGGER_PX = 24;

export const SNAP_LAYOUT_OPTIONS: SnapLayoutOption[] = [
  { target: 'maximize', label: 'Maximize', description: 'Fill the desktop above the dock.' },
  { target: 'left', label: 'Left half', description: 'Dock the window to the left side.' },
  { target: 'right', label: 'Right half', description: 'Dock the window to the right side.' },
  { target: 'top-left', label: 'Top left', description: 'Use the upper-left quadrant.' },
  { target: 'top-right', label: 'Top right', description: 'Use the upper-right quadrant.' },
  { target: 'bottom-left', label: 'Bottom left', description: 'Use the lower-left quadrant.' },
  { target: 'bottom-right', label: 'Bottom right', description: 'Use the lower-right quadrant.' },
];

const TARGET_LABELS: Record<SnapTarget, string> = {
  maximize: 'Maximize',
  left: 'Left half',
  right: 'Right half',
  'top-left': 'Top left',
  'top-right': 'Top right',
  'bottom-left': 'Bottom left',
  'bottom-right': 'Bottom right',
};

function getUsableHeight(viewport: SnapViewport): number {
  return Math.max(0, viewport.viewportHeight - viewport.dockHeight);
}

function getHalfWidth(viewportWidth: number): number {
  return Math.floor(viewportWidth / 2);
}

function getRightX(viewportWidth: number): number {
  return Math.ceil(viewportWidth / 2);
}

function getHalfHeight(viewport: SnapViewport): number {
  return Math.floor(getUsableHeight(viewport) / 2);
}

function isSnapModifierPressed(event: Pick<KeyboardEvent, 'metaKey' | 'ctrlKey' | 'altKey'>): boolean {
  return event.metaKey || (event.ctrlKey && event.altKey);
}

function isLeftSnapped(windowState: Pick<WindowState, 'x' | 'y' | 'width' | 'height'>, viewport: SnapViewport): boolean {
  return (
    windowState.x === 0 &&
    windowState.y === 0 &&
    windowState.width === getHalfWidth(viewport.viewportWidth) &&
    windowState.height === getUsableHeight(viewport)
  );
}

function isRightSnapped(windowState: Pick<WindowState, 'x' | 'y' | 'width' | 'height'>, viewport: SnapViewport): boolean {
  return (
    windowState.x === getRightX(viewport.viewportWidth) &&
    windowState.y === 0 &&
    windowState.width === getHalfWidth(viewport.viewportWidth) &&
    windowState.height === getUsableHeight(viewport)
  );
}

export function getSnapTargetLabel(target: SnapTarget): string {
  return TARGET_LABELS[target];
}

export function getSnapRect(target: SnapTarget, viewport: SnapViewport): SnapRect {
  const usableHeight = getUsableHeight(viewport);
  const halfWidth = getHalfWidth(viewport.viewportWidth);
  const rightX = getRightX(viewport.viewportWidth);
  const halfHeight = getHalfHeight(viewport);

  switch (target) {
    case 'maximize':
      return { x: 0, y: 0, width: viewport.viewportWidth, height: usableHeight };
    case 'left':
      return { x: 0, y: 0, width: halfWidth, height: usableHeight };
    case 'right':
      return { x: rightX, y: 0, width: halfWidth, height: usableHeight };
    case 'top-left':
      return { x: 0, y: 0, width: halfWidth, height: halfHeight };
    case 'top-right':
      return { x: rightX, y: 0, width: halfWidth, height: halfHeight };
    case 'bottom-left':
      return { x: 0, y: halfHeight, width: halfWidth, height: halfHeight };
    case 'bottom-right':
      return { x: rightX, y: halfHeight, width: halfWidth, height: halfHeight };
  }
}

export function getSnapPreviewState(target: SnapTarget, viewport: SnapViewport): SnapPreviewState {
  return {
    target,
    rect: getSnapRect(target, viewport),
  };
}

export function getSnapTargetFromPoint(
  clientX: number,
  clientY: number,
  viewport: SnapViewport,
  threshold: number = SNAP_TRIGGER_PX,
): SnapTarget | null {
  const usableHeight = getUsableHeight(viewport);
  const nearTop = clientY <= threshold;
  const nearBottom = clientY >= Math.max(0, usableHeight - threshold);
  const nearLeft = clientX <= threshold;
  const nearRight = clientX >= viewport.viewportWidth - threshold;

  if (nearTop && nearLeft) return 'top-left';
  if (nearTop && nearRight) return 'top-right';
  if (nearBottom && nearLeft) return 'bottom-left';
  if (nearBottom && nearRight) return 'bottom-right';
  if (nearLeft) return 'left';
  if (nearRight) return 'right';
  if (nearTop) return 'maximize';
  return null;
}

export function getSnapActionForTarget(
  target: SnapTarget,
  id: string,
  viewport: SnapViewport,
): WindowAction {
  switch (target) {
    case 'maximize':
      return {
        type: 'SNAP_MAXIMIZE',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'left':
      return {
        type: 'SNAP_LEFT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'right':
      return {
        type: 'SNAP_RIGHT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'top-left':
      return {
        type: 'SNAP_TOP_LEFT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'top-right':
      return {
        type: 'SNAP_TOP_RIGHT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'bottom-left':
      return {
        type: 'SNAP_BOTTOM_LEFT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
    case 'bottom-right':
      return {
        type: 'SNAP_BOTTOM_RIGHT',
        id,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
        dockHeight: viewport.dockHeight,
      };
  }
}

export function getKeyboardSnapTarget(
  event: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey'>,
  windowState: Pick<WindowState, 'x' | 'y' | 'width' | 'height' | 'isMaximized'>,
  viewport: SnapViewport,
): SnapTarget | null {
  if (!isSnapModifierPressed(event)) return null;

  if (event.key === 'ArrowLeft') return 'left';
  if (event.key === 'ArrowRight') return 'right';

  if (event.key === 'ArrowUp') {
    if (windowState.isMaximized) return null;
    if (isLeftSnapped(windowState, viewport)) return 'top-left';
    if (isRightSnapped(windowState, viewport)) return 'top-right';
    return 'maximize';
  }

  if (event.key === 'ArrowDown') {
    if (windowState.isMaximized) return null;
    if (isLeftSnapped(windowState, viewport)) return 'bottom-left';
    if (isRightSnapped(windowState, viewport)) return 'bottom-right';
    return null;
  }

  return null;
}

