
Cypress.Commands.add('screenSize',({size})=>{
  if (Cypress._.isArray(size)) {
    Cypress.config({
        viewportWidth: size[0],
        viewportHeight: size[1]
    })
    cy.viewport(size[0], size[1])
  } else {
    Cypress.config({
        viewportWidth: 375,
        viewportHeight: 812
    })
    cy.viewport(size)
  }
})


Cypress.Commands.add('visitpage',({url})=>{
  // cy.visit(url,{
  //   retryOnStatusCodeFailure: true,
  //   timeout: 600000,
  //   headers: {
  //     Connection: "Keep-Alive"
  //     }
  //   }
  // )
  function visitpage(Attempts){
    cy.wrap(Attempts).should('be.lt', 4)
    cy.intercept('/').as('webreq'+Attempts)
    cy.visit(url,{
      retryOnStatusCodeFailure: true,
      timeout: 600000,
      headers: {
        Connection: "Keep-Alive"
      }
    })
    cy.wait('@webreq'+Attempts).then(()=>{
      cy.get('body').then($body=>{
        if($body.find('#home').length==0 && $body.find('[class*="main-content"]').length==0
        &&$body.find('[class="search"]').length==0 && $body.find('[class*="site-wrap"]').length==0 
        &&$body.find('[class="container h-100"]').length==0&&$body.find('[id*="body"]').length==0){
          visitpage(Attempts+1)
        }
      })
    })
  }
  visitpage(0)
})

  Cypress.Commands.add('setLanguageMode',({language,mobileSelector='a'})=>{
    let languageMode
    let classAttr
    cy.get('body').then(elem => {
      if(language=='Hebrew'){
        languageMode='he'
      }else if(language=='English'){
        languageMode=''
      } 
      if(elem.attr("class").substring(0,2)=='he'|| 
      elem.attr("class").substring(elem.attr("class").length-2)=='he'){
        classAttr='he'
      }else{
        classAttr=''
      }
    }).then(()=>{
      cy.url().then(url=>{
        if(Cypress.config("viewportWidth")!=1000&&mobileSelector!='a'){
          if(url.includes('https://dev--cranky-banach-377068.netlify.app/') || 
          url.includes('https://search.dicta.org.il')){
            cy.get('#mobile-toolbar-button > .fas').click({force:true})
            cy.clickLanguage('a[class="text-body title"]',classAttr,languageMode,language)
            cy.get('.col-3 > span > .fas').click({force:true})
          }
          else{
            cy.clickLanguage('div[class*="lang-switch"]',classAttr,languageMode,language)
          }
        }else {
          cy.clickLanguage('a',classAttr,languageMode,language)
        }
      })
    })
  })
  
  Cypress.Commands.add('clickLanguage',(selector,classAttr,languageMode,language)=>{
    cy.then(()=>{
      if(classAttr!=languageMode){
        cy.log('Change to mode '+language)
        cy.get(selector,{timeout:60000}).contains(/^English$|^עברית$/g,{timeout:60000}).click({force: true});
      }
    }).then(()=>{
      if(languageMode=='he'){
        cy.get(selector,{timeout:60000}).contains(/^English$/,{timeout:60000}).should('exist')
      } else{
        cy.get(selector,{timeout:60000}).contains(/^עברית$/,{timeout:60000}).should('exist')
      }
    })
  })

