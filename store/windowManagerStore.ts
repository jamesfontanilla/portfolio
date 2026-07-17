// Window Manager State Types
// All OS UI state lives here — pure TypeScript, no side effects

export type ContentType = 'about' | 'projects' | 'certifications' | 'events' | 'contacts' | 'blog';

export interface WindowState {
  id: string;
  contentType: ContentType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximizedRect: { x: number; y: number; width: number; height: number } | null;
}

export interface Notification {
  id: string;
  message: string;
  expiresAt: number; // Date.now() + 3000
}

export interface WindowManagerState {
  windows: WindowState[];
  nextZIndex: number;    // monotonically increasing counter, starts at 100
  topZIndex: number;     // current maximum z-index in use
  dataCache: Partial<Record<ContentType, { data: unknown; fetchedAt: number }>>;
  notifications: Notification[];
  openCount: number;     // total number of windows opened in session (for stagger offset)
}

export type WindowAction =
  | { type: 'OPEN_WINDOW'; contentType: ContentType; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'CLOSE_WINDOW'; id: string }
  | { type: 'FOCUS_WINDOW'; id: string }
  | { type: 'MINIMIZE_WINDOW'; id: string }
  | { type: 'RESTORE_WINDOW'; id: string }
  | { type: 'MAXIMIZE_WINDOW'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'RESTORE_MAX_WINDOW'; id: string }
  | { type: 'DRAG_WINDOW'; id: string; dx: number; dy: number; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'RESIZE_WINDOW'; id: string; dw: number; dh: number }
  | { type: 'SNAP_MAXIMIZE'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_LEFT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_RIGHT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_TOP_LEFT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_TOP_RIGHT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_BOTTOM_LEFT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'SNAP_BOTTOM_RIGHT'; id: string; viewportWidth: number; viewportHeight: number; dockHeight: number }
  | { type: 'CACHE_DATA'; contentType: ContentType; data: unknown }
  | { type: 'DISMISS_NOTIFICATION'; id: string };

// ─── Initial State ────────────────────────────────────────────────────────────

export const initialWindowManagerState: WindowManagerState = {
  windows: [],
  nextZIndex: 100,
  topZIndex: 99,
  dataCache: {},
  notifications: [],
  openCount: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowAction,
): WindowManagerState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const { contentType, viewportWidth: vw, viewportHeight: vh, dockHeight } = action;

      // Duplicate prevention: if a window with this contentType already exists
      const existing = state.windows.find((w) => w.contentType === contentType);
      if (existing) {
        if (existing.isMinimized) {
          // Restore minimized window
          return {
            ...state,
            windows: state.windows.map((w) =>
              w.id === existing.id
                ? { ...w, isMinimized: false, isOpen: true, zIndex: state.nextZIndex }
                : w,
            ),
            nextZIndex: state.nextZIndex + 1,
            topZIndex: state.nextZIndex,
          };
        } else {
          // Focus existing window
          return {
            ...state,
            windows: state.windows.map((w) =>
              w.id === existing.id ? { ...w, zIndex: state.nextZIndex } : w,
            ),
            nextZIndex: state.nextZIndex + 1,
            topZIndex: state.nextZIndex,
          };
        }
      }

      // Compute default size (enforce minimum 320×240)
      const width = Math.max(320, Math.min(680, vw * 0.6));
      const height = Math.max(240, Math.min(520, vh * 0.7));

      // Compute stagger offset and center position
      const stagger = state.openCount * 30;
      const centerX = vw / 2 - width / 2 + stagger;
      const centerY = vh / 2 - height / 2 + stagger;

      // Clamp position so window stays within viewport
      const x = clamp(centerX, 0, Math.max(0, vw - width));
      const y = clamp(centerY, 0, Math.max(0, vh - dockHeight - height));

      const newWindow: WindowState = {
        id: crypto.randomUUID(),
        contentType,
        x,
        y,
        width,
        height,
        zIndex: state.nextZIndex,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        preMaximizedRect: null,
      };

      return {
        ...state,
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
        topZIndex: state.nextZIndex,
        openCount: state.openCount + 1,
      };
    }

    case 'CLOSE_WINDOW': {
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    }

    case 'FOCUS_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: state.nextZIndex } : w,
        ),
        nextZIndex: state.nextZIndex + 1,
        topZIndex: state.nextZIndex,
      };
    }

    case 'MINIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w,
        ),
      };
    }

    case 'RESTORE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: false, isOpen: true } : w,
        ),
      };
    }

    case 'MAXIMIZE_WINDOW': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: 0,
                width: vw,
                height: vh - dockHeight,
                isMaximized: true,
              }
            : w,
        ),
      };
    }

    case 'RESTORE_MAX_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          // We need viewport info for the fallback, but this action doesn't carry it.
          // The design specifies a relative fallback, but without vw/vh we use stored preMaximizedRect
          // or a safe absolute fallback. Per spec, default is {x: vw*0.1, y: vh*0.2, width: vw*0.8, height: vh*0.6}
          // Since RESTORE_MAX_WINDOW doesn't have viewport dims, fall back to a reasonable fixed rect
          // when preMaximizedRect is null. We'll use the preMaximizedRect if available, otherwise
          // keep the window at a reasonable state (the design default uses vw/vh but action lacks them).
          const rect = w.preMaximizedRect ?? { x: 100, y: 100, width: 680, height: 520 };
          return {
            ...w,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            isMaximized: false,
            preMaximizedRect: null,
          };
        }),
      };
    }

    case 'DRAG_WINDOW': {
      const { dx, dy, viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      const TITLE_BAR_HEIGHT = 40;
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          const newX = clamp(w.x + dx, 0, Math.max(0, vw - w.width));
          const newY = clamp(w.y + dy, 0, Math.max(0, vh - dockHeight - TITLE_BAR_HEIGHT));
          return {
            ...w,
            x: newX,
            y: newY,
            // If dragged while maximized, un-maximize
            isMaximized: false,
            preMaximizedRect: null,
          };
        }),
      };
    }

    case 'RESIZE_WINDOW': {
      const { dw, dh } = action;
      const MIN_WIDTH = 320;
      const MIN_HEIGHT = 240;
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          return {
            ...w,
            width: Math.max(MIN_WIDTH, w.width + dw),
            height: Math.max(MIN_HEIGHT, w.height + dh),
            // If the window was maximized, resizing it restores it to "normal" state
            isMaximized: false,
            preMaximizedRect: null,
          };
        }),
      };
    }

    case 'SNAP_MAXIMIZE': {
      // Same behavior as MAXIMIZE_WINDOW
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: 0,
                width: vw,
                height: vh - dockHeight,
                isMaximized: true,
              }
            : w,
        ),
      };
    }

    case 'SNAP_LEFT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: 0,
                width: Math.floor(vw / 2),
                height: vh - dockHeight,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'SNAP_RIGHT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: Math.ceil(vw / 2),
                y: 0,
                width: Math.floor(vw / 2),
                height: vh - dockHeight,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'SNAP_TOP_LEFT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      const h = Math.floor((vh - dockHeight) / 2);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: 0,
                width: Math.floor(vw / 2),
                height: h,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'SNAP_TOP_RIGHT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      const h = Math.floor((vh - dockHeight) / 2);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: Math.ceil(vw / 2),
                y: 0,
                width: Math.floor(vw / 2),
                height: h,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'SNAP_BOTTOM_LEFT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      const h = Math.floor((vh - dockHeight) / 2);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: 0,
                y: h,
                width: Math.floor(vw / 2),
                height: h,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'SNAP_BOTTOM_RIGHT': {
      const { viewportWidth: vw, viewportHeight: vh, dockHeight } = action;
      const h = Math.floor((vh - dockHeight) / 2);
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                preMaximizedRect: w.preMaximizedRect ?? { x: w.x, y: w.y, width: w.width, height: w.height },
                x: Math.ceil(vw / 2),
                y: h,
                width: Math.floor(vw / 2),
                height: h,
                isMaximized: false,
              }
            : w,
        ),
      };
    }

    case 'CACHE_DATA': {
      return {
        ...state,
        dataCache: {
          ...state.dataCache,
          [action.contentType]: {
            data: action.data,
            fetchedAt: Date.now(),
          },
        },
      };
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    }

    default: {
      // Exhaustive check — TypeScript will error if a case is missed
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
