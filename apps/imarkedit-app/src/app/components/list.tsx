import { PropsWithChildren } from 'react';

export interface ListGroupProps {
  heading?: string;
  className?: string;
}

export function ListGroup({ children, heading, className }: PropsWithChildren<ListGroupProps>) {
  return (
    <li className={className}>
      {heading && (
        <div className="text-xs font-semibold leading-6 text-indigo-200">
          {heading}
        </div>
      )}

      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {children}
      </ul>
    </li>
  );
}
