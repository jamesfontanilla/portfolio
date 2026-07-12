/**
 * layout-utils — helpers for routing and layout isolation decisions.
 *
 * Requirements: 10.1, 10.2
 */

/**
 * Returns true when the given pathname should use the OS UI (Desktop, Dock,
 * Window Manager etc.). Returns false for /studio paths, which render Sanity
 * Studio directly without the OS UI wrapper.
 */
export function shouldUseOSUI(pathname: string): boolean {
  return !pathname.startsWith('/studio');
}
