// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

if (Cypress.env("ALLOW_TERMS_OF_USE")) {
  describe("Terms of use", () => {
    const username = "bbb000@sample.org";
    let pwd = getpassword(4);

    before(() => {
      // expired = false
      // init_user = false
      cy.createuser(username, pwd, false, false);
    });

    it("Terms of Use - not accepted", () => {
      cy.visit("/app/login");
      cy.closecookielaw();

      cy.intercept("POST", "/auth/login").as("login");
      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

      cy.wait("@login");

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.checkalert("You do not provided a valid verification code");

        cy.get("div.card-header h4").contains(
          "Configure Two-Factor with Google Auth"
        );

        pwd = pwd + "!";

        cy.checkalert("You do not provided a valid verification code");
        cy.checkalert("Please change your temporary password");
        cy.get("input[placeholder='Your new password']").clear().type(pwd);
        cy.get("input[placeholder='Confirm your new password']")
          .clear()
          .type(pwd);
        cy.get("input[placeholder='TOTP verification code']")
          .clear()
          .type(get_totp());

        cy.intercept("POST", "/auth/login").as("login");
        cy.get("button").contains("Authorize").click();
        cy.wait("@login");
      } else if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
        cy.get("div.card-header.bg-warning h4").contains(
          "Please change your temporary password"
        );

        cy.checkalert("Please change your temporary password");

        pwd = pwd + "!";

        cy.get('input[placeholder="Your new password"]').clear().type(pwd);
        cy.get('input[placeholder="Confirm your new password"]')
          .clear()
          .type(pwd);
        cy.get('button:contains("Change")').click({ force: true });
      }

      cy.get("div.modal-header h4.modal-title").contains("Terms of use");

      cy.get("div.modal-footer h4").contains("Do you accept our Terms of Use?");

      cy.get("div.modal-footer button").first().contains("YES");
      cy.get("div.modal-footer button").last().contains("NO").click();

      cy.checkalert(
        "We apologize but you are not allowed to login, as you have not accepted our Terms of Use"
      );
    });

    it("Terms of Use - accepted", () => {
      cy.visit("/app/login");

      cy.intercept("POST", "/auth/login").as("login");
      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

      cy.wait("@login");
      // cy.get("input[placeholder='Your password']").should("not.exist");

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get("div.card-header h4").contains("Provide the verification code");
        cy.get("input[placeholder='TOTP verification code']").type(get_totp());
        cy.get("button").contains("Authorize").click();
      }

      cy.get("div.modal-header h4.modal-title").contains("Terms of use");

      cy.get("div.modal-footer h4").contains("Do you accept our Terms of Use?");

      cy.get("div.modal-footer button").last().contains("NO");

      cy.get("div.modal-footer button").first().contains("YES").click();

      cy.location().should((location) => {
        expect(location.pathname).to.not.equal("/app/login");
      });
    });

    it("Terms of Use - already accepted", () => {
      cy.visit("/app/login");

      cy.intercept("POST", "/auth/login").as("login");
      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

      cy.wait("@login");
      // cy.get("input[placeholder='Your password']").should("not.exist");

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get("div.card-header h4").contains("Provide the verification code");
        cy.get("input[placeholder='TOTP verification code']").type(get_totp());
        cy.get("button").contains("Authorize").click();
      }

      cy.location().should((location) => {
        expect(location.pathname).to.not.equal("/app/login");
      });

      cy.goto_profile();

      cy.get("table")
        .find("th")
        .contains("Privacy Accepted")
        .parent()
        .find(".fa-check");
    });

    after(() => {
      cy.logout();

      cy.login();

      cy.visit("/app/admin/users");

      cy.deleteuser(username);
    });
  });
}
