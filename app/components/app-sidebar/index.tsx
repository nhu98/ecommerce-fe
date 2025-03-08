import {
  Airplay,
  ChartBarStacked,
  Inbox,
  LayoutDashboard,
  PackageSearch,
  TableOfContents,
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
    title: 'Quản lý danh mục',
    url: '/admin/categories',
    icon: ChartBarStacked,
  },
  {
    title: 'Quản lý thương hiệu',
    url: '/admin/brands',
    icon: Airplay,
  },
  {
    title: 'Quản lý đơn hàng',
    url: '/admin/orders',
    icon: Inbox,
  },
  {
    title: 'Quản lý khách hàng',
    url: '/admin/accounts',
    icon: Users,
  },
  {
    title: 'Quản lý giao diện',
    url: '/admin/layout-management',
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý nội dung',
    url: '/admin/content-management',
    icon: TableOfContents,
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
