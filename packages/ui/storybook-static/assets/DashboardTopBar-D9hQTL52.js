import{j as e}from"./iframe-C4GIvfZT.js";import{L as r}from"./LogoutButton-DCjRUcJ7.js";import{m as s}from"./proxy-9GqwEgpt.js";function i({title:t,subtitle:a="Welcome",rightContent:o}){return e.jsxs(s.header,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5,ease:"easeOut"},className:"hidden md:flex justify-between items-center py-6 px-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:a}),e.jsx("h1",{className:"text-3xl font-display font-bold text-gray-800 dark:text-gray-100",children:t})]}),o||e.jsx(r,{})]})}i.__docgenInfo={description:`Component: DashboardTopBar

Generic Top Bar for dashboard layouts.
Displays a welcome message/subtitle, the portal title, and a right-side action (usually logout).
Hidden on mobile (md:flex).

@param {DashboardTopBarProps} props - Component props`,methods:[],displayName:"DashboardTopBar",props:{title:{required:!0,tsType:{name:"string"},description:'Title of the portal (e.g., "Student Portal")'},subtitle:{required:!1,tsType:{name:"string"},description:"Subtitle or welcome text",defaultValue:{value:'"Welcome"',computed:!1}},rightContent:{required:!1,tsType:{name:"ReactNode"},description:"Optional custom right-side content (default: LogoutButton)"}}};export{i as D};
