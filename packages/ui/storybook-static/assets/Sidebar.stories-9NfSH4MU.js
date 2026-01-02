import{j as e}from"./iframe-C4GIvfZT.js";import{S as n,N as s,B as i,U as l}from"./NavItem-Bhcbw74F.js";import{H as o}from"./house-CYgpX-4R.js";import{c}from"./createLucideIcon-Dg_LA61R.js";import"./preload-helper-PPVm8Dsz.js";import"./proxy-9GqwEgpt.js";import"./next-link-mock-BjjMLEqn.js";const m=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],d=c("settings",m),N={title:"Layout/Sidebar",component:n,tags:["autodocs"],parameters:{layout:"fullscreen"},args:{isOpen:!0,user:{name:"John Doe",subtitle:"Student",image:"https://i.pravatar.cc/150"}}},a={render:t=>e.jsxs("div",{className:"h-screen flex bg-gray-50 dark:bg-gray-900",children:[e.jsxs(n,{...t,children:[e.jsx(s,{href:"/",label:"Dashboard",icon:e.jsx(o,{className:"w-5 h-5"}),active:!0}),e.jsx(s,{href:"/courses",label:"Courses",icon:e.jsx(i,{className:"w-5 h-5"})}),e.jsx(s,{href:"/profile",label:"Profile",icon:e.jsx(l,{className:"w-5 h-5"})}),e.jsx(s,{href:"/settings",label:"Settings",icon:e.jsx(d,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"flex-1 p-8",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Main Content"}),e.jsx("p",{children:"This is where the page content lives."})]})]})},r={args:{isOpen:!1},render:t=>e.jsx("div",{className:"h-screen flex bg-gray-50 dark:bg-gray-900",children:e.jsx(n,{...t,children:e.jsx(s,{href:"/",label:"Dashboard",icon:e.jsx(o,{className:"w-5 h-5"}),active:!0})})}),parameters:{viewport:{defaultViewport:"mobile1"}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar {...args}>
        <NavItem href="/" label="Dashboard" icon={<Home className="w-5 h-5" />} active />
        <NavItem href="/courses" label="Courses" icon={<Book className="w-5 h-5" />} />
        <NavItem href="/profile" label="Profile" icon={<User className="w-5 h-5" />} />
        <NavItem href="/settings" label="Settings" icon={<Settings className="w-5 h-5" />} />
      </Sidebar>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>This is where the page content lives.</p>
      </div>
    </div>
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: false
  },
  render: args => <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar {...args}>
        <NavItem href="/" label="Dashboard" icon={<Home className="w-5 h-5" />} active />
      </Sidebar>
    </div>,
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...r.parameters?.docs?.source}}};const v=["Default","MobileClosed"];export{a as Default,r as MobileClosed,v as __namedExportsOrder,N as default};
