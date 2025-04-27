(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function i(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=i(r);fetch(r.href,s)}})();const k="modulepreload",N=function(e){return"/"+e},R={},E=function(o,i,a){let r=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(i.map(d=>{if(d=N(d),d in R)return;R[d]=!0;const m=d.endsWith(".css"),t=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${t}`))return;const n=document.createElement("link");if(n.rel=m?"stylesheet":k,m||(n.as="script"),n.crossOrigin="",n.href=d,c&&n.setAttribute("nonce",c),document.head.appendChild(n),m)return new Promise((y,v)=>{n.addEventListener("load",y),n.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return r.then(l=>{for(const c of l||[])c.status==="rejected"&&s(c.reason);return o().catch(s)})};function M(e,o){let i=!0;const a=()=>{e.innerHTML=`
      <div class="auth-container">
        <h2>${i?"Login":"Register"}</h2>
        <form class="auth-form" id="authForm">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">${i?"Login":"Register"}</button>
        </form>
        <div class="auth-toggle">
          <button id="toggleAuth">
            ${i?"Need an account? Register":"Already have an account? Login"}
          </button>
        </div>
        <div class="demo-account">
          <button id="demoAccountBtn">Try Demo Account</button>
        </div>
        <div class="direct-access">
          <button id="directAccessBtn">Direct Access (No Login)</button>
        </div>
      </div>
    `,document.getElementById("toggleAuth").addEventListener("click",()=>{i=!i,a()}),document.getElementById("authForm").addEventListener("submit",async r=>{r.preventDefault();const s=document.getElementById("email").value,l=document.getElementById("password").value;try{const{loginUser:c,registerUser:d}=await E(async()=>{const{loginUser:m,registerUser:t}=await Promise.resolve().then(()=>f);return{loginUser:m,registerUser:t}},void 0);i?await c(s,l):await d(s,l),o&&o()}catch(c){alert(`Error: ${c.message}`)}}),document.getElementById("demoAccountBtn").addEventListener("click",async()=>{try{const{loginUser:r}=await E(async()=>{const{loginUser:c}=await Promise.resolve().then(()=>f);return{loginUser:c}},void 0),s="demo@example.com",l="demo123";document.getElementById("email").value=s,document.getElementById("password").value=l,await r(s,l),o&&o()}catch(r){alert(`Error logging in with demo account: ${r.message}`)}}),document.getElementById("directAccessBtn").addEventListener("click",async()=>{try{const{loginUser:r}=await E(async()=>{const{loginUser:s}=await Promise.resolve().then(()=>f);return{loginUser:s}},void 0);await r(),o&&o()}catch(r){alert(`Error with direct access: ${r.message}`)}})};a()}let U;const H=new Uint8Array(16);function j(){if(!U&&(U=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!U))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return U(H)}const u=[];for(let e=0;e<256;++e)u.push((e+256).toString(16).slice(1));function W(e,o=0){return u[e[o+0]]+u[e[o+1]]+u[e[o+2]]+u[e[o+3]]+"-"+u[e[o+4]]+u[e[o+5]]+"-"+u[e[o+6]]+u[e[o+7]]+"-"+u[e[o+8]]+u[e[o+9]]+"-"+u[e[o+10]]+u[e[o+11]]+u[e[o+12]]+u[e[o+13]]+u[e[o+14]]+u[e[o+15]]}const J=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),T={randomUUID:J};function A(e,o,i){if(T.randomUUID&&!e)return T.randomUUID();e=e||{};const a=e.random||(e.rng||j)();return a[6]=a[6]&15|64,a[8]=a[8]&63|128,W(a)}function F(e,o,i){let a=[];const r=async()=>{try{const{getOverlays:c,deleteOverlay:d,logoutUser:m}=await E(async()=>{const{getOverlays:t,deleteOverlay:n,logoutUser:y}=await Promise.resolve().then(()=>f);return{getOverlays:t,deleteOverlay:n,logoutUser:y}},void 0);a=await c(),e.innerHTML=`
        <div class="dashboard">
          <div class="dashboard-header">
            <h1>My Overlays</h1>
            <div>
              <button id="createOverlayBtn">Create New Overlay</button>
              <button id="logoutBtn">Logout</button>
            </div>
          </div>
          
          <div class="overlay-list">
            ${a.length>0?a.map(t=>`
                <div class="overlay-card">
                  <h3>${t.title||"Untitled Overlay"}</h3>
                  <p>${t.targetUrl||"No target URL"}</p>
                  <div class="overlay-card-actions">
                    <button class="edit-btn" data-id="${t.id}">Edit</button>
                    <button class="share-btn" data-id="${t.id}">Share</button>
                    <button class="preview-btn" data-id="${t.id}">Preview</button>
                    <button class="delete-btn" data-id="${t.id}">Delete</button>
                  </div>
                </div>
              `).join(""):"<p>No overlays yet. Create your first one!</p>"}
          </div>
        </div>
      `,document.getElementById("createOverlayBtn").addEventListener("click",()=>{i()}),document.getElementById("logoutBtn").addEventListener("click",async()=>{await m(),o&&o()}),document.querySelectorAll(".edit-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id");i(n)})}),document.querySelectorAll(".share-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id");s(n)})}),document.querySelectorAll(".preview-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id");l(n)})}),document.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",async()=>{const n=t.getAttribute("data-id");confirm("Are you sure you want to delete this overlay?")&&(await d(n),r())})})}catch(c){e.innerHTML=`<p>Error loading dashboard: ${c.message}</p>`}},s=c=>{const d=a.find(n=>n.id===c);if(!d)return;const m=`${window.location.origin}/overlay.html?id=${c}`,t=document.createElement("div");t.className="share-modal",t.innerHTML=`
      <div class="share-container">
        <button class="share-close">&times;</button>
        <h2>Share Overlay</h2>
        <p>Share this URL with anyone to display your overlay on ${d.targetUrl||"any website"}:</p>
        <div class="share-url">
          <input type="text" value="${m}" readonly id="shareUrlInput" />
          <button id="copyUrlBtn">Copy</button>
        </div>
        <p class="share-instructions">
          <strong>Instructions:</strong><br>
          1. Copy this URL<br>
          2. Share it with your audience<br>
          3. When they visit this URL, they'll see the target website with your overlay
        </p>
      </div>
    `,document.body.appendChild(t),t.querySelector(".share-close").addEventListener("click",()=>{document.body.removeChild(t)}),document.getElementById("copyUrlBtn").addEventListener("click",()=>{document.getElementById("shareUrlInput").select(),document.execCommand("copy"),alert("URL copied to clipboard!")})},l=async c=>{try{const{getOverlayById:d}=await E(async()=>{const{getOverlayById:n}=await Promise.resolve().then(()=>f);return{getOverlayById:n}},void 0),m=await d(c),t=document.createElement("div");t.className="overlay-preview",t.innerHTML=`
        <div class="preview-container">
          <button class="preview-close">&times;</button>
          <div class="overlay-content">
            <h1>${m.title||"Untitled Overlay"}</h1>
            ${m.sections.map(n=>`
              <div class="overlay-section">
                ${n.title?`<h2>${n.title}</h2>`:""}
                ${n.type==="video"?`
                  <video class="overlay-video" controls>
                    <source src="${n.content}" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                `:n.type==="image"?`
                  <img class="overlay-image" src="${n.content}" alt="${n.title||"Image"}" />
                `:`
                  <div class="overlay-text">${n.content}</div>
                `}
              </div>
            `).join("")}
          </div>
        </div>
      `,document.body.appendChild(t),t.querySelector(".preview-close").addEventListener("click",()=>{document.body.removeChild(t)})}catch(d){alert(`Error loading preview: ${d.message}`)}};r()}function Y(e,o,i,a){let r={title:"",targetUrl:"",sections:[]};const s=async()=>{try{if(o){const{getOverlayById:t}=await E(async()=>{const{getOverlayById:n}=await Promise.resolve().then(()=>f);return{getOverlayById:n}},void 0);r=await t(o)}e.innerHTML=`
        <div class="overlay-editor">
          <div class="editor-header">
            <h1>${o?"Edit Overlay":"Create New Overlay"}</h1>
          </div>
          
          <form class="editor-form" id="overlayForm">
            <div class="form-group">
              <label for="title">Overlay Title</label>
              <input type="text" id="title" value="${r.title||""}" placeholder="Enter a title for your overlay" required />
            </div>
            
            <div class="form-group">
              <label for="targetUrl">Target Website URL</label>
              <input type="url" id="targetUrl" value="${r.targetUrl||""}" placeholder="https://example.com" required />
              <small>This is the website where your overlay will appear</small>
            </div>
            
            <h2>Content Sections</h2>
            <div id="sectionsContainer">
              ${r.sections&&r.sections.length>0?r.sections.map((t,n)=>l(t,n)).join(""):""}
            </div>
            
            <button type="button" id="addSectionBtn" class="add-section-btn">+ Add Section</button>
            
            <div class="editor-actions">
              <button type="button" class="cancel-btn" id="cancelBtn">Cancel</button>
              <button type="submit" class="save-btn">Save Overlay</button>
            </div>
          </form>
        </div>
      `,document.getElementById("addSectionBtn").addEventListener("click",()=>{c()}),document.getElementById("cancelBtn").addEventListener("click",()=>{a&&a()}),document.getElementById("overlayForm").addEventListener("submit",async t=>{t.preventDefault();const n=document.getElementById("title").value,y=document.getElementById("targetUrl").value,v=[];document.querySelectorAll(".section-container").forEach(h=>{const x=h.querySelector("select").value,_=h.querySelector(".section-title").value,V=h.querySelector(".section-content-input").value;v.push({type:x,title:_,content:V})});const p={...r,id:o,title:n,targetUrl:y,sections:v};try{const{saveOverlay:h}=await E(async()=>{const{saveOverlay:_}=await Promise.resolve().then(()=>f);return{saveOverlay:_}},void 0),x=await h(p);i&&i(x)}catch(h){alert(`Error saving overlay: ${h.message}`)}}),d(),(!r.sections||r.sections.length===0)&&c()}catch(t){e.innerHTML=`<p>Error loading editor: ${t.message}</p>`}},l=(t={type:"text",title:"",content:""},n)=>`
      <div class="section-container" data-index="${n}">
        <div class="section-header">
          <h3>Section ${n+1}</h3>
          <button type="button" class="remove-section-btn" data-index="${n}">&times;</button>
        </div>
        
        <div class="section-content">
          <div class="form-group">
            <label>Section Type</label>
            <select class="section-type">
              <option value="text" ${t.type==="text"?"selected":""}>Text</option>
              <option value="image" ${t.type==="image"?"selected":""}>Image</option>
              <option value="video" ${t.type==="video"?"selected":""}>Video</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Section Title (optional)</label>
            <input type="text" class="section-title" value="${t.title||""}" placeholder="Section title" />
          </div>
          
          <div class="form-group">
            <label>${t.type==="text"?"Text Content":t.type==="image"?"Image URL":"Video URL"}</label>
            ${t.type==="text"?`<textarea class="section-content-input" rows="4" placeholder="Enter your text content here...">${t.content||""}</textarea>`:`<input type="url" class="section-content-input" value="${t.content||""}" placeholder="${t.type==="image"?"https://example.com/image.jpg":"https://example.com/video.mp4"}" />`}
          </div>
        </div>
      </div>
    `,c=()=>{const t=document.getElementById("sectionsContainer"),n=t.children.length,y=l({type:"text",title:"",content:""},n);t.insertAdjacentHTML("beforeend",y),d()},d=()=>{document.querySelectorAll(".remove-section-btn").forEach(t=>{t.addEventListener("click",n=>{const y=parseInt(n.target.getAttribute("data-index"));m(y)})}),document.querySelectorAll(".section-type").forEach(t=>{t.addEventListener("change",n=>{const v=n.target.closest(".section-container").querySelector(".section-content .form-group:last-child"),b=v.querySelector(".section-content-input").value,p=n.target.value,h=v.querySelector("label");p==="text"?(h.textContent="Text Content",v.innerHTML=`
            <label>Text Content</label>
            <textarea class="section-content-input" rows="4" placeholder="Enter your text content here...">${b}</textarea>
          `):(h.textContent=p==="image"?"Image URL":"Video URL",v.innerHTML=`
            <label>${p==="image"?"Image URL":"Video URL"}</label>
            <input type="url" class="section-content-input" value="${b}" placeholder="${p==="image"?"https://example.com/image.jpg":"https://example.com/video.mp4"}" />
          `)})})},m=t=>{const n=document.getElementById("sectionsContainer"),y=document.querySelector(`.section-container[data-index="${t}"]`);y&&(n.removeChild(y),document.querySelectorAll(".section-container").forEach((b,p)=>{b.setAttribute("data-index",p),b.querySelector("h3").textContent=`Section ${p+1}`,b.querySelector(".remove-section-btn").setAttribute("data-index",p)}))};s()}const $={id:"demo-user-id",email:"demo@example.com"},L={USER:"web_overlay_user",OVERLAYS:"web_overlay_items"},C=(e,o)=>{const i={...$,email:e||$.email};return localStorage.setItem(L.USER,JSON.stringify(i)),Promise.resolve(i)},z=(e,o)=>C(e),G=()=>(localStorage.removeItem(L.USER),Promise.resolve()),S=()=>{const e=localStorage.getItem(L.USER);return e?JSON.parse(e):null},q=e=>{e(S());const o=i=>{i.key===L.USER&&e(S())};return window.addEventListener("storage",o),()=>{window.removeEventListener("storage",o)}},O=()=>{const e=localStorage.getItem(L.OVERLAYS);return e?JSON.parse(e):[]},B=e=>{localStorage.setItem(L.OVERLAYS,JSON.stringify(e))},K=async e=>{const o=S();if(!o)throw new Error("User not authenticated");const i={...e,userId:o.id,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},a=O();if(e.id){const r=a.findIndex(s=>s.id===e.id);if(r!==-1)a[r]={...i,updatedAt:new Date().toISOString()};else throw new Error("Overlay not found")}else i.id=A(),a.push(i);return B(a),i.id},Q=async()=>{const e=S();if(!e)throw new Error("User not authenticated");return O().filter(i=>i.userId===e.id)},X=async e=>{const i=O().find(a=>a.id===e);if(i)return i;throw new Error("Overlay not found")},Z=async e=>{const o=S();if(!o)throw new Error("User not authenticated");const i=O(),a=i.find(s=>s.id===e);if(!a)throw new Error("Overlay not found");if(a.userId!==o.id)throw new Error("Not authorized");const r=i.filter(s=>s.id!==e);B(r)},D=()=>{if(O().length===0){const o=[{id:A(),userId:$.id,title:"Welcome Message",targetUrl:"https://example.com",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sections:[{type:"text",title:"Welcome to our site!",content:"Thank you for visiting. This is a sample overlay that demonstrates how you can create custom messages for your visitors."},{type:"image",title:"Sample Image",content:"https://picsum.photos/800/400"}]},{id:A(),userId:$.id,title:"Product Announcement",targetUrl:"https://mozilla.org",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sections:[{type:"text",title:"New Product Launch",content:"We're excited to announce our newest product! Check out the details below."},{type:"video",title:"Product Demo",content:"https://www.w3schools.com/html/mov_bbb.mp4"},{type:"text",title:"Limited Time Offer",content:"Get 20% off if you order within the next 24 hours!"}]}];B(o)}},f=Object.freeze(Object.defineProperty({__proto__:null,deleteOverlay:Z,getCurrentUser:S,getOverlayById:X,getOverlays:Q,initializeSampleData:D,loginUser:C,logoutUser:G,onAuthChange:q,registerUser:z,saveOverlay:K},Symbol.toStringTag,{value:"Module"}));D();const I=document.querySelector("#app");let g="auth",P=null;const w=()=>{switch(I.innerHTML="",g){case"auth":M(I,()=>{g="dashboard",w()});break;case"dashboard":F(I,()=>{g="auth",w()},e=>{P=e,g="editor",w()});break;case"editor":Y(I,P,()=>{g="dashboard",w()},()=>{g="dashboard",w()});break}};q(e=>{e?g="dashboard":g="auth",w()});w();
