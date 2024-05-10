import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { PropsWithChildren } from 'react';

export interface DrawerLinkProps {
  to?: string;
  className?: string;
}

export function DrawerLink({ to, children, className }: PropsWithChildren<DrawerLinkProps>) {
  if (!to) return (
    <span className={twMerge(
      'nav-link-inactive',
      'nav-link',
      className
    )}>
      {children}
    </span>
  );
  return (
    <NavLink to={to} className={({ isActive }) => twMerge(
      isActive ? 'nav-link-active' : 'nav-link-inactive',
      'nav-link',
      className
    )}>
      {children}
    </NavLink>
  );
}
