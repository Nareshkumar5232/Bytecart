import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../logo.png';

export default function Logo({ light = false, className = '', size = 'default' }) {
  // Height sizing tailored for the tightly-cropped 773x160 logo
  const heightClass =
    size === 'large'
      ? 'h-11 sm:h-13 md:h-15'
      : size === 'small'
      ? 'h-7 sm:h-8'
      : 'h-8 sm:h-9 md:h-10';

  return (
    <Link to="/" className={`inline-flex items-center group select-none ${className}`}>
      <img
        src={logoImg}
        alt="BYTECART PRIVATE LIMITED"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
          light ? 'brightness-0 invert' : ''
        }`}
      />
    </Link>
  );
}
