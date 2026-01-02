import{j as e}from"./iframe-C4GIvfZT.js";import{m as p}from"./proxy-9GqwEgpt.js";import{H as u}from"./house-CYgpX-4R.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-Dg_LA61R.js";function c({title:o,description:l,breadcrumb:t,children:i,showHomeIcon:n=!0}){return e.jsxs(p.header,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},transition:{duration:.4,ease:"easeOut"},className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6",children:[e.jsxs("div",{children:[(t||n)&&e.jsxs("div",{className:"text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1",children:[n&&e.jsx(u,{className:"w-4 h-4"}),t&&t.map((m,d)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"/"}),e.jsx("span",{className:d===t.length-1?"font-medium text-gray-900 dark:text-white":"",children:m.label})]},d)),!t&&n&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"/"}),e.jsx("span",{className:"font-medium text-gray-900 dark:text-white",children:o})]})]}),e.jsx("h1",{className:"text-2xl md:text-3xl font-bold text-gray-900 dark:text-white pt-2",children:o}),e.jsx("span",{className:"text-sm text-gray-500 dark:text-gray-400 block mt-1",children:l})]}),i&&e.jsx("div",{className:"flex items-center gap-4",children:i})]})}c.__docgenInfo={description:`Shared dashboard header component.
Displays title, description, breadcrumbs, and action buttons.

@param {DashboardHeaderProps} props - Component properties`,methods:[],displayName:"DashboardHeader",props:{title:{required:!0,tsType:{name:"string"},description:"Page title"},description:{required:!0,tsType:{name:"string"},description:"Page description"},breadcrumb:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; href?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!1}}]}}],raw:"{ label: string; href?: string }[]"},description:"Breadcrumb elements or path"},children:{required:!1,tsType:{name:"ReactNode"},description:"Right-side actions (buttons, toggles)"},showHomeIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show the home icon in breadcrumbs",defaultValue:{value:"true",computed:!1}}}};const y={title:"Layout/DashboardHeader",component:c,tags:["autodocs"],args:{title:"Page Title",description:"This is a description of the current page."}},r={args:{breadcrumb:[{label:"Home",href:"/"},{label:"Current Page"}]}},a={args:{showHomeIcon:!1}},s={args:{children:e.jsx("button",{className:"bg-blue-600 text-white px-4 py-2 rounded-lg",children:"Action"})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    breadcrumb: [{
      label: "Home",
      href: "/"
    }, {
      label: "Current Page"
    }]
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    showHomeIcon: false
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Action
      </button>
  }
}`,...s.parameters?.docs?.source}}};const j=["Default","WithoutBreadcrumb","WithActions"];export{r as Default,s as WithActions,a as WithoutBreadcrumb,j as __namedExportsOrder,y as default};
