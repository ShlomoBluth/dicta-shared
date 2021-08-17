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