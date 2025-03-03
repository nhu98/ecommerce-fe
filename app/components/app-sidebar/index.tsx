import {
  Airplay,
  ChartBarStacked,
  Inbox,
  PackageSearch,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
const items = [
  {
    title: 'Quản lý sản phẩm',
    url: '/admin',
    icon: PackageSearch,
  },
  {
    title: 'Quản lý danh mục sản phẩm',
    url: '/admin/categories',
    icon: ChartBarStacked,
  },
  {
    title: 'Quản lý thương hiệu sản phẩm',
    url: '/admin/brands',
    icon: Airplay,
  },
  {
    title: 'Quản lý đơn hàng',
    url: '/admin/orders',
    icon: Inbox,
  },
  {
    title: 'Quản lý tài khoản',
    url: '/admin/accounts',
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="absolute h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
