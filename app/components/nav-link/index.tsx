import Link from 'next/link';
import React from 'react';

export interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface Props {
  links: NavLink[];
}

const NavLinks: React.FC<Props> = ({ links }) => {
  return (
    <div>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs md:text-base hover:text-red-500 mr-4"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
