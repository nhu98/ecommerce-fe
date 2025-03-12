import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SheetComponentProps {
  childTrigger: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode | null;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
}

export function SheetComponent({
  childTrigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  side,
}: SheetComponentProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>{childTrigger}</SheetTrigger>
      <SheetContent className="overflow-auto" side={side ? side : 'right'}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          {footer}
          {/*<SheetClose asChild>*/}
          {/*  <Button type="submit">Save changes</Button>*/}
          {/*</SheetClose>*/}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
