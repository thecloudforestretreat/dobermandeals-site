/* /assets/js/site.js */
/* Doberman Deals: fixed header spacer + mobile overlay menu with Close button */

(function(){
  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function ensureSpacer(){
    var siteHeaderMount = qs("#siteHeader");
    if(!siteHeaderMount) return;

    var next = siteHeaderMount.nextElementSibling;
    if(!next || !next.classList.contains("ddHeaderSpacer")){
      var spacer = document.createElement("div");
      spacer.className = "ddHeaderSpacer";
      siteHeaderMount.parentNode.insertBefore(spacer, siteHeaderMount.nextSibling);
    }

    var header = qs("header.ddHeader[data-dd-header]");
    if(!header) return;

    var h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--dd-header-h", h + "px");
  }

  function injectMobileTop(panel){
    if(!panel) return;
    if(qs(".ddMobileTop", panel)) return;

    var top = document.createElement("div");
    top.className = "ddMobileTop";

    var title = document.createElement("div");
    title.className = "ddMobileTitle";

    var img = document.createElement("img");
    img.src = "/assets/images/dd_logo_transparent.png";
    img.alt = "Doberman Deals";
    img.decoding = "async";
    img.loading = "eager";

    var text = document.createElement("span");
    text.textContent = "Doberman Deals";

    title.appendChild(img);
    title.appendChild(text);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ddMobileClose";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.textContent = "X";

    top.appendChild(title);
    top.appendChild(closeBtn);

    // Insert at top of panel
    panel.insertBefore(top, panel.firstChild);
  }

  function setupHeader(){
    var header = qs("header.ddHeader[data-dd-header]");
    if(!header) return;

    var burger = qs("[data-dd-burger]", header);
    var mobile = qs("[data-dd-mobile]", header);
    if(!burger || !mobile) return;

    var panel = qs(".ddMobileLinks", mobile);
    if(!panel) return;

    if(burger.__ddBound) return;
    burger.__ddBound = true;

    injectMobileTop(panel);

    var closeBtn = qs(".ddMobileClose", panel);

    function openMenu(){
      mobile.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("ddMenuOpen");
    }

    function closeMenu(){
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("ddMenuOpen");
    }

    function toggleMenu(){
      if(mobile.hidden) openMenu();
      else closeMenu();
    }

    burger.addEventListener("click", function(e){
      e.preventDefault();
      toggleMenu();
    });

    if(closeBtn){
      closeBtn.addEventListener("click", function(e){
        e.preventDefault();
        closeMenu();
      });
    }

    // Tap outside panel closes
    mobile.addEventListener("click", function(e){
      if(e.target === mobile) closeMenu();
    });

    // Clicking any menu link closes
    qsa(".ddMobileLink", panel).forEach(function(a){
      a.addEventListener("click", function(){ closeMenu(); });
    });

    // ESC closes
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeMenu();
    });

    // Resize: recompute spacer and close menu if going desktop
    window.addEventListener("resize", function(){
      ensureSpacer();
      try{
        if(window.matchMedia && window.matchMedia("(min-width: 981px)").matches){
          closeMenu();
        }
      }catch(err){}
    }, { passive:true });

    closeMenu();
    ensureSpacer();

    // If logo loads later, recalc
    try{
      var img = qs(".ddBrandLogo", header);
      if(img && !img.complete){
        img.addEventListener("load", function(){ ensureSpacer(); }, { once:true });
      }
    }catch(e){}
  }

  function boot(){
    setupHeader();
    ensureSpacer();

    setTimeout(ensureSpacer, 50);
    setTimeout(ensureSpacer, 250);
    setTimeout(ensureSpacer, 800);

    if(window.ResizeObserver){
      try{
        var header = qs("header.ddHeader[data-dd-header]");
        if(header){
          var ro = new ResizeObserver(function(){ ensureSpacer(); });
          ro.observe(header);
        }
      }catch(e){}
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }

  // If header is injected after load
  window.addEventListener("dd:includes:ready", boot);
  window.addEventListener("mbw:includes:ready", boot);
})();
