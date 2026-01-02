import{r as i,j as e,s as l}from"./iframe-C4GIvfZT.js";import{m as d}from"./proxy-9GqwEgpt.js";import{c}from"./createLucideIcon-Dg_LA61R.js";import{A as u}from"./arrow-right-B48TApEx.js";import"./preload-helper-PPVm8Dsz.js";const m=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],p=c("loader-circle",m);function n(){const[t,a]=i.useState(!1),s=async()=>{a(!0);const r=typeof window<"u"&&localStorage.getItem("forceFreshAuth")==="true";r&&localStorage.removeItem("forceFreshAuth"),await l("wso2",{callbackUrl:"/"},r?{prompt:"login"}:void 0)};return e.jsxs(d.button,{whileHover:{scale:1.02,filter:"brightness(1.05)"},whileTap:{scale:.95},onClick:s,disabled:t,className:`
        w-full flex items-center justify-center gap-2
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700
        dark:from-blue-500 dark:to-purple-500
        dark:hover:from-blue-600 dark:hover:to-purple-600
        text-white font-semibold 
        py-4 px-8 rounded-xl
        shadow-lg shadow-blue-500/30 dark:shadow-blue-900/40
        hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-900/50
        transition-all duration-300 
        disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
        group
      `,children:[e.jsx("span",{children:t?"Connecting...":"Get Started"}),t?e.jsx(p,{className:"w-4 h-4 animate-spin"}):e.jsx(u,{className:"w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"})]})}n.__docgenInfo={description:`LoginButton Component.

Renders a primary call-to-action button that initiates the WSO2 OIDC login flow.
Uses Lucide icons for visual enhancement.

@returns {JSX.Element} The rendered button component.`,methods:[],displayName:"LoginButton"};const x={title:"Auth/LoginButton",component:n,tags:["autodocs"]},o={};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};const v=["Default"];export{o as Default,v as __namedExportsOrder,x as default};
