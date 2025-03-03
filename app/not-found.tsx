import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        <Button className="bg-red-500 hover:bg-red-600 text-white mt-4">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
