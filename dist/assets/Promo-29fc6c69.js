import{r as i,i as l,j as e}from"./index-65adc0db.js";const d=()=>{const[r,o]=i.useState(0),a=5;l(),i.useEffect(()=>{const t=setInterval(()=>{o(s=>s>=a-1?(clearInterval(t),s):s+1)},4e3);return()=>clearInterval(t)},[]);const n=[{id:0,bgColor:"#1E4A35",content:e.jsxs("div",{className:"slide-content animate-pop-in",children:[e.jsx("img",{src:"/icons/icon-512x512.png",alt:"Logo",style:{width:"150px",marginBottom:"2rem",borderRadius:"20px",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}),e.jsx("h1",{style:{color:"#fff",fontSize:"2.5rem",textTransform:"uppercase",letterSpacing:"2px"},children:"Kisan Bazaar"}),e.jsx("p",{style:{color:"#D4A017",fontSize:"1.5rem",marginTop:"1rem"},children:"किसानों का अपना बाज़ार"})]})},{id:1,bgColor:"#D32F2F",content:e.jsxs("div",{className:"slide-content animate-slide-left",children:[e.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"😫"}),e.jsxs("h2",{style:{color:"#fff",fontSize:"2rem",lineHeight:"1.4"},children:["क्या आप मंडियों के चक्कर",e.jsx("br",{}),"और ",e.jsx("span",{style:{color:"#FFD700"},children:"बिचौलियों"})," से",e.jsx("br",{}),"परेशान हैं?"]})]})},{id:2,bgColor:"#2E7D32",content:e.jsxs("div",{className:"slide-content animate-zoom-in",children:[e.jsx("div",{style:{fontSize:"4rem",marginBottom:"1rem"},children:"🏠🚜"}),e.jsxs("h2",{style:{color:"#fff",fontSize:"2rem",lineHeight:"1.4"},children:["अब अपनी फसल बेचें",e.jsx("br",{}),e.jsx("span",{style:{color:"#D4A017",fontSize:"2.5rem",fontWeight:"800"},children:"घर बैठे"}),e.jsx("br",{}),"सीधे खरीदार को!"]})]})},{id:3,bgColor:"#1565C0",content:e.jsxs("div",{className:"slide-content animate-fade-up",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"2rem",marginBottom:"2rem"},children:[e.jsxs("div",{className:"feature-icon",children:["📈",e.jsx("br",{}),"मंडी भाव"]}),e.jsxs("div",{className:"feature-icon",children:["🌦️",e.jsx("br",{}),"मौसम"]})]}),e.jsxs("h2",{style:{color:"#fff",fontSize:"1.8rem"},children:["पाएं रोज़ाना मंडी भाव",e.jsx("br",{}),"और सटीक मौसम जानकारी"]})]})},{id:4,bgColor:"#1E4A35",content:e.jsxs("div",{className:"slide-content animate-pulse",children:[e.jsx("img",{src:"/icons/icon-512x512.png",alt:"App",style:{width:"100px",marginBottom:"1rem",borderRadius:"15px"}}),e.jsx("h2",{style:{color:"#fff",marginBottom:"2rem"},children:"आज ही डाउनलोड करें!"}),e.jsx("div",{style:{background:"#fff",padding:"1rem 2rem",borderRadius:"50px",color:"#1E4A35",fontWeight:"bold",fontSize:"1.2rem"},children:"kisanbazzar.co.in"}),e.jsx("div",{style:{marginTop:"2rem",color:"#D4A017"},children:"👇 Link in Bio"})]})}];return e.jsxs("div",{className:"promo-container",children:[n.map((t,s)=>e.jsx("div",{className:`slide ${s===r?"active":""}`,style:{backgroundColor:t.bgColor},children:t.content},t.id)),e.jsx("style",{children:`
                .promo-container {
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    position: relative;
                    font-family: 'Poppins', sans-serif;
                }

                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    opacity: 0;
                    transform: scale(1.1);
                    transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
                    padding: 2rem;
                }

                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                    z-index: 10;
                }

                .feature-icon {
                    background: rgba(255,255,255,0.2);
                    padding: 1.5rem;
                    border-radius: 20px;
                    color: white;
                    font-weight: bold;
                    font-size: 1.2rem;
                    backdrop-filter: blur(10px);
                }

                /* Animations */
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .slide.active .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

                @keyframes slideLeft {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .slide.active .animate-slide-left { animation: slideLeft 0.8s ease-out forwards; }

                @keyframes zoomIn {
                    from { transform: scale(1.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .slide.active .animate-zoom-in { animation: zoomIn 0.8s ease-out forwards; }

                @keyframes fadeUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .slide.active .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .slide.active .animate-pulse { animation: pulse 2s infinite ease-in-out; }
            `})]})};export{d as default};
