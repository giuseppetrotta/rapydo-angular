// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ChangePassword", () => {
  beforeEach(() => {
    cy.login();

    const email = "aaaaaaaaaa000111@sample.org";
    const pwd = "Looooong!";

    cy.createuser(email, pwd);

    cy.logout();
  });

  it("ChangePassword", () => {
    const email = "aaaaaaaaaa000111@sample.org";
    let pwd = "Looooong!";

    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").clear().type(username);
    cy.get("input[placeholder='Your password']")
      .clear()
      .type(pwd + "{enter}");

    if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE")) {
      cy.get(".card-header h4").contains(
        "Please change your temporary password"
      );

      pwd = pwd + "!";

      cy.get('input[placeholder="Your new password"]').clear().type(pwd);
      cy.get('input[placeholder="Confirm your new password"]')
        .clear()
        .type(pwd);
      cy.get('button:contains("Change")').click({ force: true });
    }

    cy.visit("/app/profile/changepassword");
    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    // Go back
    cy.get("button:contains('Cancel')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("a:contains('CHANGE')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.get("button:contains('Submit')").click();
    cy.checkvalidation(0, "This field is required");

    cy.get('input[placeholder="Type here your current password"]').as(
      "password"
    );
    cy.get('input[placeholder="Type the desidered new password"]').as(
      "new_password"
    );
    cy.get(
      'input[placeholder="Type again the new password for confirmation"]'
    ).as("confirm_password");

    cy.get("@password").clear().type("wrong");
    cy.get("@new_password").clear().type("short");
    cy.checkvalidation(0, "Should have at least 8 characters");
    cy.get("@new_password").clear().type("looooong");
    cy.get("@confirm_password").clear().type("short");
    cy.checkvalidation(0, "The password does not match");
    cy.get("@confirm_password").clear().type("looooong");

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Shorter than minimum length 8.");
    cy.get("@password").clear().type("wrong-password");

    cy.get("button:contains('Submit')").click();
    cy.checkalert(
      "Your request cannot be authorized, is current password wrong?"
    );

    cy.get("@password").clear().type(pwd);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_password").clear().type("LOOOOONG");
    cy.get("@confirm_password").clear().type("LOOOOONG");
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    cy.get("@new_password").clear().type("LoOoOoNg");
    cy.get("@confirm_password").clear().type("LoOoOoNg");
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing numbers");

    cy.get("@new_password").clear().type("LoO0OoNg");
    cy.get("@confirm_password").clear().type("LoO0OoNg");
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing special characters");

    cy.get("@new_password").clear().type(pwd);
    cy.get("@confirm_password").clear().type(pwd);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("The new password cannot match the previous password");

    const newPassword = "LoO0OoNg!";
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);

    // Check backend errors
    cy.server();
    cy.route({
      method: "PUT",
      url: "/auth/profile",
      status: 500,
      response: "Stubbed change password error",
    });

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Stubbed change password error");
    cy.server({ enable: false });

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password successfully changed");

    // After the notification an asynchronous call is executed to login with the new credentials
    // Let's wait a bit to prevent to continue before the call is executed
    cy.wait(500);

    cy.visit("/app/profile");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
    cy.get("table").find("td").contains(email);
  });

  afterEach(() => {
    cy.logout();

    cy.login();
    cy.deleteuser("aaaaaaaaaa000111@sample.org");
  });
});
