/* /assets/js/site.js */
/* Doberman Deals: fixed header spacer + mobile overlay menu toggle */

(function(){
  function qs(sel, root){
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function ensureSpacer(){
    var siteHeaderMount = qs('#siteHeader');
    if(!siteHeaderMount) return;

    // Create spacer right after #siteHeader (once)
    var next = siteHeaderMount.nextElementSibling;
    if(!next || !next.classList.contains('ddHeaderSpacer')){
      var spacer = document.createElement('div');
      spacer.className = 'ddHeaderSpacer';
      siteHeaderMount.parentNode.insertBefore(spacer, siteHeaderMount.nextSibling);
    }

    // Measure header height and store in CSS var
    var header = qs('header.ddHeader[data-dd-header]');
    if(!header) return;

    // header includes top padding; measure actual rendered height
    var h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--dd-header-h', h + 'px');
  }

  function setupHeader(){
    var header = qs('header.ddHeader[data-dd-header]');
    if(!header) return;

    var burger = qs('[data-dd-burger]', header);
    var mobile = qs('[data-dd-mobile]', header);

    if(!burger || !mobile) return;

    if(burger.__ddBound) return;
    burger.__ddBound = true;

    function openMenu(){
      mobile.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('ddMenuOpen');
    }

    function closeMenu(){
      mobile.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('ddMenuOpen');
    }

    function toggleMenu(){
      if(mobile.hidden) openMenu();
      else closeMenu();
    }

    burger.addEventListener('click', function(e){
      e.preventDefault();
      toggleMenu();
    });

    // Click outside panel closes
    mobile.addEventListener('click', function(e){
      var panel = qs('.ddMobileLinks', mobile);
      if(!panel) return;
      if(e.target === mobile) closeMenu();
    });

    // Clicking any mobile link closes
    qsa('.ddMobileLink', mobile).forEach(function(a){
      a.addEventListener('click', function(){
        closeMenu();
      });
    });

    // ESC closes
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });

    // Recompute spacer on resize
    window.addEventListener('resize', function(){
      ensureSpacer();
      try{
        if(window.matchMedia && window.matchMedia('(min-width: 981px)').matches){
          closeMenu();
        }
      }catch(err){}
    }, { passive: true });

    // Start closed
    closeMenu();

    // Ensure spacer after header exists and correct
    ensureSpacer();

    // If images in header load later, recalc once
    try{
      var img = qs('.ddBrandLogo', header);
      if(img && !img.complete){
        img.addEventListener('load', function(){ ensureSpacer(); }, { once:true });
      }
    }catch(e){}
  }

  function boot(){
    setupHeader();
    ensureSpacer();

    // Re-run shortly after load in case includes/fonts affect final height
    setTimeout(ensureSpacer, 50);
    setTimeout(ensureSpacer, 250);
    setTimeout(ensureSpacer, 800);

    if(window.ResizeObserver){
      try{
        var header = qs('header.ddHeader[data-dd-header]');
        if(header){
          var ro = new ResizeObserver(function(){ ensureSpacer(); });
          ro.observe(header);
        }
      }catch(e){}
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }

  // If your header is injected after load
  window.addEventListener('dd:includes:ready', boot);
  window.addEventListener('mbw:includes:ready', boot);
})();
