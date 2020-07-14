// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminStats", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/admin/stats");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/stats");
    });
  });

  it("View stats", () => {
    // The endpoint quite slow due to the ping to calculate the network latency
    // Let's wait a bit before starting the tests
    cy.wait(5000);

    cy.get("div.card-header h4").contains("Server Stats");

    cy.get("table")
      .find("th")
      .contains("Server uptime")
      .parent()
      .contains("ago");

    cy.get("table").find("th.table-primary").contains("CPU");
    cy.get("table")
      .find("th")
      .contains("Num")
      .parent()
      .get("td")
      .should("be.gte", 1);
    cy.get("table").find("th").contains("Load").parent().contains(".");
    cy.get("table").find("th").contains("Load").parent().contains("%");

    cy.get("table").find("th.table-primary").contains("Disk");
    cy.get("table").find("th").contains("Root size").parent().contains(".");
    cy.get("table").find("th").contains("Root size").parent().contains(" GB");
    cy.get("table").find("th").contains("Used").parent().contains(".");
    cy.get("table").find("th").contains("Used").parent().contains(" GB");
    cy.get("table").find("th").contains("Used").parent().contains("%)");
    cy.get("table").find("th").contains("Free").parent().contains(".");
    cy.get("table").find("th").contains("Free").parent().contains(" GB");

    cy.get("table").find("th.table-primary").contains("RAM");
    cy.get("table").find("th").contains("Total").parent().contains(" MB");
    cy.get("table").find("th").contains("Used").parent().contains(" MB");
    cy.get("table").find("th").contains("Free").parent().contains(" MB");
    cy.get("table").find("th").contains("Cache").parent().contains(" MB");
    cy.get("table").find("th").contains("Buffer").parent().contains(" MB");
    cy.get("table").find("th").contains("Active").parent().contains(" MB");
    cy.get("table").find("th").contains("Inactive").parent().contains(" MB");

    cy.get("table").find("th.table-primary").contains("Swap");
    cy.get("table").find("th").contains("Total size").parent().contains(" MB");
    cy.get("table").find("th").contains("Free").parent().contains(" MB");
    cy.get("table").find("th").contains("Used").parent().contains(" MB");
    cy.get("table").find("th").contains("from disk").parent().contains(" MB/s");
    cy.get("table").find("th").contains("to disk").parent().contains(" MB/s");

    cy.get("table").find("th.table-primary").contains("Network");
    cy.get("table").find("th").contains("Min Latency").parent().contains(" ms");
    cy.get("table").find("th").contains("Avg Latency").parent().contains(" ms");
    cy.get("table").find("th").contains("Max Latency").parent().contains(" ms");

    cy.get("table").find("th.table-primary").contains("I/O");
    cy.get("table")
      .find("th")
      .contains("Blocks received")
      .parent()
      .get("td")
      .should("be.gte", 1);
    cy.get("table")
      .find("th")
      .contains("Blocks sent")
      .parent()
      .get("td")
      .should("be.gte", 1);

    cy.get("table").find("th.table-primary").contains("Procs");

    cy.get("table")
      .find("th")
      .contains("Waiting for run")
      .parent()
      .get("td")
      .should("be.gte", 1);
    cy.get("table")
      .find("th")
      .contains("Uninterruptible sleep")
      .parent()
      .get("td")
      .should("be.gte", 1);
  });
});