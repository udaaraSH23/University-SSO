import{u as a,j as e}from"./iframe-C4GIvfZT.js";import{c as d}from"./createLucideIcon-Dg_LA61R.js";const i=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],c=d("log-out",i);var u={};function l(){const{data:t}=a(),r=()=>{const n=u.NEXT_PUBLIC_WSO2_LOGOUT_URL||"https://wso2is.com/t/universityportal.com/oidc/logout",s=`${window.location.origin}/auth/logout-callback`,o=new URL(n);o.searchParams.set("post_logout_redirect_uri",s),t?.idToken&&o.searchParams.set("id_token_hint",t.idToken),window.location.href=o.toString()};return e.jsxs("button",{onClick:r,className:`
        flex items-center justify-center gap-2 
        px-6 py-3 rounded-xl
        text-sm font-semibold
        bg-white dark:bg-gray-800
        text-red-600 dark:text-red-400
        border-2 border-red-200 dark:border-red-800
        hover:bg-red-50 dark:hover:bg-red-950/30
        hover:border-red-300 dark:hover:border-red-700
        hover:text-red-700 dark:hover:text-red-300
        shadow-sm hover:shadow-md
        transition-all duration-300
        transform hover:scale-[1.02] active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-red-500 dark:focus:ring-red-400
        dark:focus:ring-offset-gray-900
      `,"aria-label":"Sign out",children:[e.jsx(c,{className:"w-4 h-4"}),e.jsx("span",{children:"Sign Out"})]})}l.__docgenInfo={description:`LogoutButton Component.

Renders a button that initiates a federated logout flow.
1. Redirects to WSO2 IdP to terminate global session.
2. WSO2 redirects back to /auth/logout-callback (server route).
3. Server route clears NextAuth session and redirects to login.`,methods:[],displayName:"LogoutButton"};export{l as L};
