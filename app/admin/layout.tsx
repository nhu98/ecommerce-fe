import { AppSidebar } from '@/app/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="relative border">
      <AppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  );
}
