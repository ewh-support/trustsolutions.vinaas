/* eslint-disable */
/* Work on modification of the script to detect all the Form extractions associated with the client application */
!(function() {
  var NotifyME = {
    // $forms: null,
    domLoaded: [false, false],
    $submitButtons: null,
    $submitInputs: null,
    href: null,
    hostname: null,
    restURL: null,
    requestObj: null,
    allowSubmit: null,
    init() {
      // NotifyME.$forms         = document.getElementsByTagName("form");
      NotifyME.$submitButtons = document.querySelectorAll('button[type=submit]');
      NotifyME.$submitInputs = document.querySelectorAll('input[type=submit]');
      var domain = `${window.location.protocol}//${window.location.hostname}`;
      if (window.location.port) {
        domain = `${domain}:${window.location.port}`;
      }
      NotifyME.restURL = 'https://api.buzzz.io/hit';
      // NotifyME.restURL = 'https://notifyme.api.uat.1020dev.com/hit';
      // NotifyME.restURL = 'http://localhost:3003/hit';
      NotifyME.href = encodeURIComponent(window.location.href);
      NotifyME.domain = domain;
      NotifyME.hostname = window.location.hostname;
      NotifyME.allowSubmit = false;
      if (NotifyME.$submitButtons.length) {
        for (var i = 0; i < NotifyME.$submitButtons.length; i++) {
          NotifyME.$submitButtons[i].addEventListener('click', NotifyME.makeRequest, true);
          NotifyME.$submitButtons[i].addEventListener('touchstart', NotifyME.makeRequest, true);
        }
        NotifyME.domLoaded[0] = true;
      }
      if (NotifyME.$submitInputs.length) {
        for (var i = 0; i < NotifyME.$submitInputs.length; i++) {
          NotifyME.$submitInputs[i].addEventListener('click', NotifyME.makeRequest, true);
          NotifyME.$submitInputs[i].addEventListener('touchstart', NotifyME.makeRequest, true);
        }
        NotifyME.domLoaded[1] = true;
      }
      /* for (var i = 0; i < NotifyME.$forms.length; i++) {
                NotifyME.$forms[i].addEventListener("click", NotifyME.makeRequest);
            } */
      NotifyME.setRequestObject();

      if(!(NotifyME.domLoaded[0] || NotifyME.domLoaded[1])){
        console.log('re trigger NotifyMe');
        setTimeout(NotifyME.init, 5000);
      }
    },
    makeRequest(event) {
      // console.log("The Submission Button Has Been Clicked", NotifyME.allowSubmit, event.currentTarget);
      if (NotifyME.allowSubmit) {
        NotifyME.allowSubmit = false;
        return;
      }
      event.preventDefault();

      const $button = event.currentTarget;
      const $form = NotifyME.closest($button);

      /**
       * * Check if form satisfies , ALl the html 5 validations
       * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity
       */
      if (typeof $form.reportValidity === 'function' && !$form.reportValidity()) {
        return;
      }
      const completeDataSet = new FormData();
      const formData = { id: $form.id, name: $form.name, form_fields: [] };
      for (let i = 0; i < $form.elements.length; i++) {
        const item = $form.elements.item(i);
        if (item.type !== 'submit' && item.type !== 'hidden') {
          if (item.type === 'checkbox' || item.type === 'radio') {
            item.checked &&
              formData.form_fields.push({
                type: item.type,
                key: item.name || item.id,
                value: item.type === 'file' ? null : item.value
              });
          } else {
            formData.form_fields.push({
              type: item.type,
              key: item.name || item.id,
              value: item.type === 'file' ? null : item.value
            });
          }

          if (item.type === 'file' && (item.name || item.id)) {
            const file_list = item.name
              ? document.getElementsByName(item.name)[0].files
              : document.getElementById(item.id).files;
            for (let j = 0; j < file_list.length; j++) {
              completeDataSet.append('file', file_list[j], item.name || item.id);
            }
          }
        }
      }
      formData['href-notify'] = NotifyME.href;
      formData['hostname-notify'] = NotifyME.hostname;
      formData.domain = NotifyME.domain;

      /** Check for query parameters */
      formData.q = NotifyME.getQueryString('q');
      completeDataSet.append('form_fields', JSON.stringify(formData));
      NotifyME.requestObj.open('POST', NotifyME.restURL, true);
      /* the reload is so fast that before the request gets set...the page reloads... */

      NotifyME.requestObj.send(completeDataSet || JSON.stringify(formData));
      NotifyME.allowSubmit = true;
      NotifyME.requestObj.onreadystatechange = function() {
        if (this.readyState == 3) {
          $button.click();
          setTimeout(function() {
            NotifyME.allowSubmit = false;
          }, 2000);
        }
      };
    },
    closest(el) {
      const selector = 'form';
      while (el) {
        if (el.matches(selector)) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    },
    setRequestObject() {
      if (typeof XMLHttpRequest !== 'undefined') {
        NotifyME.requestObj = new XMLHttpRequest();
      } else {
        for (
          let n = [
              'MSXML2.XmlHttp.5.0',
              'MSXML2.XmlHttp.4.0',
              'MSXML2.XmlHttp.3.0',
              'MSXML2.XmlHttp.2.0',
              'Microsoft.XmlHttp'
            ],
            o = 0,
            p = n.length;
          p > o;
          o++
        ) {
          try {
            NotifyME.requestObj = new ActiveXObject(n[o]);
            break;
          } catch (i) {
            console.log('error occured due to : ', i);
          }
        }
      }
    },
    getQueryString(field, url) {
      const href = url || window.location.href;
      const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
      const string = reg.exec(href);
      return string ? string[1] : null;
    }
  };

  NotifyME.init();
})();
