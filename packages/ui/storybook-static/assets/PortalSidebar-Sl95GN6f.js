import{j as a}from"./iframe-C4GIvfZT.js";import{u as s}from"./next-navigation-mock-CFlQeLup.js";import{S as d,N as p}from"./NavItem-Bhcbw74F.js";import{m as r}from"./proxy-9GqwEgpt.js";function m({items:n,...t}){const i=s(),o=e=>e.exact===!1?i.startsWith(e.href):i===e.href;return a.jsx(d,{...t,children:a.jsx(r.div,{initial:"hidden",animate:"show",variants:{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},children:n.map(e=>a.jsx(r.div,{variants:{hidden:{opacity:0,x:-20},show:{opacity:1,x:0}},children:a.jsx(p,{href:e.href,icon:e.icon,label:e.label,active:o(e),badge:e.badge})},e.href))})})}m.__docgenInfo={description:`Component: PortalSidebar

A specialized wrapper around the generic Sidebar component.
Renders a list of navigation items with active state handling and animations.

@param {PortalSidebarProps} props - Component props including items list`,methods:[],displayName:"PortalSidebar",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"SidebarItem"}],raw:"SidebarItem[]"},description:""},pendingBooksCount:{required:!1,tsType:{name:"number"},description:""}},composes:["Omit"]};export{m as P};
