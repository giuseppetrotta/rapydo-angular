// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Responsive tests", () => {
  let expected_collapsed_navbar = false;

  beforeEach(() => {
    expected_collapsed_navbar = false;
  });

  it("iphone-4 portrait", () => {
    cy.viewport(320, 480);
    expected_collapsed_navbar = true;
  });

  it("iphone-4 landscape", () => {
    cy.viewport(480, 320);
    expected_collapsed_navbar = true;
  });

  it("iphone-6 portrait", () => {
    cy.viewport(375, 667);
    expected_collapsed_navbar = true;
  });

  it("iphone-6 landscape", () => {
    cy.viewport(667, 375);
  });

  it("ipad-2 portrait", () => {
    cy.viewport(768, 1024);
  });

  it("ipad-2 landscape", () => {
    cy.viewport(1024, 768);
  });

  it("HD Ready portrait", () => {
    cy.viewport(720, 1280);
  });

  it("HD Ready landscape", () => {
    cy.viewport(1280, 720);
  });

  it("Full HD portrait", () => {
    cy.viewport(1080, 1920);
  });

  it("Full HD landscape", () => {
    cy.viewport(1920, 1080);
  });

  it("Quad HD resolution", () => {
    cy.viewport(2560, 1440);
  });

  it("4K Ultra HD resolution", () => {
    cy.viewport(3840, 2160);
  });

  it("8K", () => {
    cy.viewport(7680, 4320);
  });

  afterEach(() => {
    cy.visit("/app/login");

    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );

    cy.get("button").contains("Login").click();

    cy.get("input[placeholder='Your password']").should("not.exist");

    if (expected_collapsed_navbar) {
      cy.get("button.navbar-toggler").click();
    }
    cy.get("a").find(".fas.fa-user.fa-lg").parent().click();
    // cy.visit("/app/profile");
    cy.get("div.card-header h4").contains("Your profile");

    // Confirm modal is not opened on Cypress when navbar is collapsed...
    // cy.logout(expected_collapsed_navbar);
  });
});
