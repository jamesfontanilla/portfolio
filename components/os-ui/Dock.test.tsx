/**
 * Dock unit tests
 *
 * Unit test (task 10.9): Notification auto-dismiss — advance fake timers 3000ms,
 * assert onDismissNotification called with the notification id.
 *
 * Validates: Requirements 2.10
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { Dock } from './Dock';
import type { Notification } from '@/store/windowManagerStore';

describe('Dock notification auto-dismiss', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('calls onDismissNotification with the notification id after 3000ms', async () => {
    const onDismissNotification = vi.fn();

    const notification: Notification = {
      id: 'notif-1',
      message: 'Test notification',
      expiresAt: Date.now() + 3000,
    };

    render(
      <Dock
        windows={[]}
        notifications={[notification]}
        onIconClick={() => {}}
        onDismissNotification={onDismissNotification}
      />,
    );

    // Not yet called
    expect(onDismissNotification).not.toHaveBeenCalled();

    // Advance timers by 3000ms
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Should have been called with the notification id
    expect(onDismissNotification).toHaveBeenCalledTimes(1);
    expect(onDismissNotification).toHaveBeenCalledWith('notif-1');
  });

  it('calls onDismissNotification for each notification at its respective expiry', async () => {
    const onDismissNotification = vi.fn();

    const now = Date.now();
    const notifications: Notification[] = [
      { id: 'notif-a', message: 'First', expiresAt: now + 1000 },
      { id: 'notif-b', message: 'Second', expiresAt: now + 3000 },
    ];

    render(
      <Dock
        windows={[]}
        notifications={notifications}
        onIconClick={() => {}}
        onDismissNotification={onDismissNotification}
      />,
    );

    expect(onDismissNotification).not.toHaveBeenCalled();

    // Advance 1000ms — first notification expires
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(onDismissNotification).toHaveBeenCalledTimes(1);
    expect(onDismissNotification).toHaveBeenCalledWith('notif-a');

    // Advance another 2000ms — second notification expires
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(onDismissNotification).toHaveBeenCalledTimes(2);
    expect(onDismissNotification).toHaveBeenCalledWith('notif-b');
  });

  it('does not call onDismissNotification when no notifications are present', async () => {
    const onDismissNotification = vi.fn();

    render(
      <Dock
        windows={[]}
        notifications={[]}
        onIconClick={() => {}}
        onDismissNotification={onDismissNotification}
      />,
    );

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(onDismissNotification).not.toHaveBeenCalled();
  });

  it('does not call onDismissNotification when callback not provided', async () => {
    // Should not throw
    const notification: Notification = {
      id: 'notif-x',
      message: 'No callback',
      expiresAt: Date.now() + 100,
    };

    expect(() => {
      render(
        <Dock
          windows={[]}
          notifications={[notification]}
          onIconClick={() => {}}
        />,
      );
    }).not.toThrow();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
  });
});
