import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.items ? (
                        <CollapsibleItem
                            key={item.title}
                            item={item}
                            isCurrentUrl={isCurrentUrl}
                        />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(String(item.href))}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function CollapsibleItem({
    item,
    isCurrentUrl,
}: {
    item: NavItem;
    isCurrentUrl: (href: string) => boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={{ children: item.title }}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto transition-transform duration-200 data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {(item.items ?? []).map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isCurrentUrl(String(sub.href))}
                                >
                                    <Link href={sub.href} prefetch>
                                        {sub.icon && <sub.icon />}
                                        <span>{sub.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
