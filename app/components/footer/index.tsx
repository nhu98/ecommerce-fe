import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and description */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Image
                src="https://picsum.photos/id/236/40/40"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="ml-2 font-bold text-xl">DevShop</span>
            </div>
            <p className="text-gray-500 mt-2">
              Solid is the information & experience directed at an end-user
            </p>
            <div className="flex mt-4">
              <Facebook className="text-gray-500 hover:text-blue-500 mr-2" />
              <Twitter className="text-gray-500 hover:text-blue-500 mr-2" />
              <Instagram className="text-gray-500 hover:text-pink-500 mr-2" />
              <Linkedin className="text-gray-500 hover:text-blue-500" />
            </div>
          </div>

          {/* Các liên kết */}
          <div className="flex flex-col self-start md:flex-row md:self-center">
            <div className="md:mr-16">
              <h4 className="font-bold mb-2">ABOUT US</h4>
              <ul className="text-gray-500">
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">FAQ&#39;s</Link>
                </li>
              </ul>
            </div>
            <div className="md:mr-16">
              <h4 className="font-bold mb-2">INFORMATION</h4>
              <ul className="text-gray-500">
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">FAQ&#39;s</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">MY ACCOUNT</h4>
              <ul className="text-gray-500">
                <li>
                  <Link href="#">Wishlist</Link>
                </li>
                <li>
                  <Link href="#">Cart</Link>
                </li>
                <li>
                  <Link href="#">Checkout</Link>
                </li>
                <li>
                  <Link href="#">My Account</Link>
                </li>
                <li>
                  <Link href="#">Shop</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* More information */}
        <div className="mt-8 border-t border-gray-300 text-center text-gray-500">
          <p className="mt-4">Copyright & Design By Nhu Huynh - 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
