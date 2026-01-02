import{j as r}from"./iframe-C4GIvfZT.js";import{L as p}from"./next-link-mock-BjjMLEqn.js";import{a as v}from"./next-navigation-mock-CFlQeLup.js";import{c as y}from"./createLucideIcon-Dg_LA61R.js";import"./preload-helper-PPVm8Dsz.js";const f=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],h=y("chevron-left",f);const j=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],b=y("chevron-right",j);function x({currentPage:e,totalPages:o,onPageChange:g,basePath:d}){const P=v(),l=a=>{if(!d)return"#";const s=new URLSearchParams(P.toString());return s.set("page",a.toString()),`${d}?${s.toString()}`},m=!d;return o<=1?null:r.jsxs("div",{className:"flex items-center justify-center space-x-2 mt-6",children:[m?r.jsx("button",{onClick:()=>g?.(Math.max(1,e-1)),disabled:e===1,className:"p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors","aria-label":"Previous Page",children:r.jsx(h,{className:"w-4 h-4"})}):r.jsx(p,{href:e>1?l(e-1):"#","aria-disabled":e===1,className:`p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${e===1?"opacity-50 pointer-events-none":""}`,"aria-label":"Previous Page",children:r.jsx(h,{className:"w-4 h-4"})}),r.jsx("div",{className:"flex items-center space-x-1",children:Array.from({length:o},(a,s)=>s+1).map(a=>{const u=`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${a===e?"bg-blue-600 text-white":"text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`;return m?r.jsx("button",{onClick:()=>g?.(a),className:u,children:a},a):r.jsx(p,{href:l(a),className:u,children:a},a)})}),m?r.jsx("button",{onClick:()=>g?.(Math.min(o,e+1)),disabled:e===o,className:"p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors","aria-label":"Next Page",children:r.jsx(b,{className:"w-4 h-4"})}):r.jsx(p,{href:e<o?l(e+1):"#","aria-disabled":e===o,className:`p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${e===o?"opacity-50 pointer-events-none":""}`,"aria-label":"Next Page",children:r.jsx(b,{className:"w-4 h-4"})})]})}x.__docgenInfo={description:`Shared Pagination component.
Supports both Client-side (onPageChange) and Server-side (Link) pagination.`,methods:[],displayName:"Pagination",props:{currentPage:{required:!0,tsType:{name:"number"},description:""},totalPages:{required:!0,tsType:{name:"number"},description:""},onPageChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:""},basePath:{required:!1,tsType:{name:"string"},description:""}}};const w={title:"Common/Pagination",component:x,tags:["autodocs"],argTypes:{currentPage:{control:"number"},totalPages:{control:"number"}}},n={args:{currentPage:1,totalPages:10,onPageChange:e=>console.log(`Page changed to ${e}`)}},t={args:{currentPage:5,totalPages:10,onPageChange:e=>console.log(`Page changed to ${e}`)}},i={args:{currentPage:10,totalPages:10,onPageChange:e=>console.log(`Page changed to ${e}`)}},c={args:{currentPage:1,totalPages:5,basePath:"/courses"},parameters:{nextjs:{appDirectory:!0}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: page => console.log(\`Page changed to \${page}\`)
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: page => console.log(\`Page changed to \${page}\`)
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: page => console.log(\`Page changed to \${page}\`)
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    currentPage: 1,
    totalPages: 5,
    basePath: "/courses"
  },
  parameters: {
    nextjs: {
      appDirectory: true
    }
  }
}`,...c.parameters?.docs?.source}}};const _=["Default","MiddlePage","LastPage","ServerSide"];export{n as Default,i as LastPage,t as MiddlePage,c as ServerSide,_ as __namedExportsOrder,w as default};
