
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
    // cy.document().then(function (doc) {
    // doc.addEventListener('mouseover', () => {
    //   setTimeout(function () {
    //     doc.location.replace("https://synoptic.dicta.org.il/")
    //   }, 15000)
    // })
    // cy.get(elem).contains(text).click()
    //cy.get(elem).contains(text).click({force:true})
  //})
    cy.wait('@webreq'+Attempts).then(()=>{
      cy.get('body').then($body=>{
        if($body.find('#home').length==0 && $body.find('[class*="main-content"]').length==0){
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
      if(Cypress.config("viewportWidth")!=1000&&mobileSelector=='lang-switch'){
        cy.clickLanguage('div[class*="lang-switch"]',classAttr,languageMode,language)
      }else {
        cy.clickLanguage('a',classAttr,languageMode,language)
      }
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

