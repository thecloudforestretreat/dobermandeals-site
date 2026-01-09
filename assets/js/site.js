/* /assets/js/site.js */
/* Doberman Deals: mobile menu overlay toggle for header.html */

(function(){
  function qs(sel, root){
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setupHeader(){
    var header = qs('header.ddHeader[data-dd-header]');
    if(!header) return;

    var burger = qs('[data-dd-burger]', header);
    var mobile = qs('[data-dd-mobile]', header);

    if(!burger || !mobile) return;

    // Prevent double-binding
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

    // Click outside the panel closes (overlay click)
    mobile.addEventListener('click', function(e){
      // ddMobileLinks is the panel; clicking the dark overlay should close
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

    // If resizing to desktop, force-close
    window.addEventListener('resize', function(){
      try{
        if(window.matchMedia && window.matchMedia('(min-width: 981px)').matches){
          closeMenu();
        }
      }catch(err){}
    }, { passive: true });

    // Safety: start closed
    closeMenu();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupHeader);
  }else{
    setupHeader();
  }

  // If you load header via includes.js, it may arrive after DOMContentLoaded.
  // Re-run when includes are ready (safe even if event never fires).
  window.addEventListener('dd:includes:ready', setupHeader);
  window.addEventListener('mbw:includes:ready', setupHeader);
})();
