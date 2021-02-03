// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("Login", () => {
  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    it("TOTP", () => {
      const email = "aaaaaaaaaa000555" + Math.random() + "@sample.org";
      const pwd = getpassword(4);

      cy.login();
      cy.createuser(email, pwd, true);
      cy.logout();

      cy.visit("/app/login");
      cy.closecookielaw();

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(pwd);
      cy.get("button").contains("Login").click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });

      cy.checkalert("You do not provided a valid second factor");
      cy.get("div.card-header h4").contains("Provide the verification code");
      cy.get("button").contains("Authorize").click();

      // fill the form! Not yet implemented

      // cy.logout();
      cy.login();
      cy.deleteuser(email);
    });
  }
});
