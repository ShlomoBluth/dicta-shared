
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
    function visitpage(status,Attempts){
      if(status!=200){
        cy.wrap(Attempts).should('be.lt', 10)
        cy.intercept(url).as('webreq'+Attempts)
        cy.visit(url,{
            headers: {
                Connection: "Keep-Alive"
                }
            }
        )
        cy.get('@webreq'+Attempts).then(req=>{
          visitpage(req.response.statusCode,Attempts+1)
        })
      }
    }
    visitpage(0,0)
  })

import addContext from 'mochawesome/addContext'

Cypress.on("test:after:run", (test, runnable) => {
    
    let videoName = Cypress.spec.name
    videoName = videoName.replace('/.js.*', '.js')
    const videoUrl = 'videos/' + videoName + '.mp4'

    addContext({ test }, videoUrl)
});