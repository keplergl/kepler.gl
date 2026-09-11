// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react';
import {createPortal} from 'react-dom';
import {RootContext, SidebarFactory} from '@kepler.gl/components';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  TooltipProvider,
  useSidebar
} from '@sqlrooms/ui';

const SidebarTargetContext = createContext<HTMLDivElement | null>(null);

export type KeplerAppShellProps = PropsWithChildren<{
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  title?: string;
  readOnly?: boolean;
  modalOpen?: boolean;
  sidebarWidth?: number;
}>;

/** SQLRooms application chrome around the complete Kepler application. */
export function KeplerAppShell({
  children,
  sidebarOpen,
  onSidebarOpenChange,
  title = 'Kepler.gl',
  readOnly = false,
  modalOpen = false,
  sidebarWidth = 320
}: KeplerAppShellProps) {
  const [sidebarTarget, setSidebarTarget] = useState<HTMLDivElement | null>(null);
  return (
    <SidebarTargetContext.Provider value={sidebarTarget}>
      <TooltipProvider>
        <SidebarProvider
          className="kepler-app-shell h-full min-h-0"
          open={sidebarOpen && !readOnly}
          onOpenChange={onSidebarOpenChange}
          style={{'--sidebar-width': `${sidebarWidth}px`} as React.CSSProperties}
        >
          <DismissMobileSidebar modalOpen={modalOpen} />
          {!readOnly && (
            <Sidebar collapsible="offcanvas" className="border-r border-border">
              <div
                ref={setSidebarTarget}
                className="relative flex h-full min-h-0 flex-col bg-background"
              />
            </Sidebar>
          )}
          <SidebarInset className="min-h-0 min-w-0 bg-background">
            {!readOnly && (
              <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-card px-3">
                <SidebarTrigger aria-label="Toggle sidebar" title="Toggle sidebar" />
                <span className="truncate text-sm text-foreground">{title}</span>
              </header>
            )}
            <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </SidebarTargetContext.Provider>
  );
}

/**
 * Move Kepler's original sidebar contents into the shell while retaining their
 * Redux, intl, feature flags, cloud provider, and drag-and-drop contexts.
 * Use with KeplerAppShell and sidePanelWidth={0}; the shell reserves the width.
 */
export function SqlroomsSidebarFactory(...deps: Parameters<typeof SidebarFactory>) {
  const OriginalSidebar = SidebarFactory(...deps);
  return function SqlroomsSidebar(props: React.ComponentProps<typeof OriginalSidebar>) {
    const target = useContext(SidebarTargetContext);
    const rootRef = useMemo(() => ({current: target}), [target]);
    return target
      ? createPortal(
          <RootContext.Provider value={rootRef}>{props.children}</RootContext.Provider>,
          target
        )
      : null;
  };
}
SqlroomsSidebarFactory.deps = SidebarFactory.deps;

// Kepler dialogs live in the map tree. Close the mobile Sheet before displaying
// them so its focus trap and pointer boundary cannot block the dialog.
function DismissMobileSidebar({modalOpen}: {modalOpen: boolean}) {
  const {openMobile, setOpenMobile} = useSidebar();
  useEffect(() => {
    if (modalOpen && openMobile) setOpenMobile(false);
  }, [modalOpen, openMobile, setOpenMobile]);
  return null;
}
