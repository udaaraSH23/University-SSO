import React, { ReactNode } from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

const Link = ({ children, href, ...props }: LinkProps) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
