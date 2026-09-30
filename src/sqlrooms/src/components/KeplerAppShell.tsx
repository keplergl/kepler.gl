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
import {PanelLeftClose, PanelLeftOpen} from 'lucide-react';
import {
  Button,
  Sidebar,
  SidebarInset,
  SidebarProvider,
  TooltipProvider,
  useSidebar
} from '@sqlrooms/ui';

const SidebarTargetContext = createContext<HTMLDivElement | null>(null);

export type KeplerAppShellProps = PropsWithChildren<{
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  readOnly?: boolean;
  modalOpen?: boolean;
  sidebarWidth?: number;
}>;

/** SQLRooms application chrome around the complete Kepler application. */
export function KeplerAppShell({
  children,
  sidebarOpen,
  onSidebarOpenChange,
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
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {children}
              {!readOnly && !modalOpen && <SidebarToggleButton />}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </SidebarTargetContext.Provider>
  );
}

function SidebarToggleButton() {
  const {open, openMobile, isMobile, toggleSidebar} = useSidebar();
  const expanded = isMobile ? openMobile : open;
  const label = expanded ? 'Close sidebar' : 'Open sidebar';
  const Icon = expanded ? PanelLeftClose : PanelLeftOpen;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-sidebar="trigger"
      aria-label={label}
      aria-expanded={expanded}
      title={label}
      onClick={toggleSidebar}
      className="absolute left-2.5 top-2.5 z-10 h-7 w-7 rounded-sm border border-border bg-card p-0 text-foreground shadow-sm hover:bg-accent"
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
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
