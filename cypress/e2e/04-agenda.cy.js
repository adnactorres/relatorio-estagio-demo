describe("Agenda", () => {
  beforeEach(() => cy.abrirRelatorio());

  it("mostra compromissos de hoje, próximos dias e o reporte da daily", () => {
    cy.get("#agn").within(() => {
      cy.contains("h3", "Compromissos de hoje");
      cy.contains("h3", "Próximos dias");
      cy.contains("h3", "Meu reporte para a daily");
      cy.get(".agn-ev").should("have.length.greaterThan", 0);
    });
  });

  it("indica a daily do squad em que trabalhei no último dia", () => {
    cy.get("#agn .agn-ev").contains("Daily do Squad Atlas")
      .parents(".agn-ev")
      .should("contain", "Você trabalhou na UFVS 15");
  });

  it("agrupa o reporte por squad", () => {
    cy.get("#agn .agn-g").contains("b", "Squad Atlas")
      .parents(".agn-g")
      .should("contain", "UFVS · 15");
  });

  it("pergunta o squad de uma OS desconhecida e move o item quando respondo", () => {
    cy.get("#agn .agn-ask").should("contain", "De qual squad é a UECV 5?");
    cy.get('#agn .agn-ask button[data-agnsq="Squad Atlas"]').click();

    cy.get("#agn .agn-ask").should("not.exist");
    cy.get("#agn .agn-g").contains("b", "Squad Atlas")
      .parents(".agn-g")
      .should("contain", "UECV · 5")
      .and("contain", "UFVS · 15");
  });

  it("adiciona um lembrete e só remove depois de confirmar", () => {
    const daqui3dias = new Date(Date.now() + 3 * 864e5);
    const data = [
      daqui3dias.getFullYear(),
      String(daqui3dias.getMonth() + 1).padStart(2, "0"),
      String(daqui3dias.getDate()).padStart(2, "0"),
    ].join("-");

    cy.get("#agn .agn-row").its("length").then((antes) => {
      cy.get("#fabBtn").click();
      cy.get("[data-fab=lem]").click();
      cy.get("#ev-d").clear().type(data);
      cy.get("#ev-h").type("16:00");
      cy.get("#ev-t").select("Planning");
      cy.get("#ev-ti").type("Revisar casos de teste");
      cy.get("#evSave").click();
      cy.get("#evStatus").should("have.text", "Lembrete salvo.");

      cy.get("#agn .agn-row").should("have.length", antes + 1);
      cy.contains("#agn .agn-row", "Revisar casos de teste")
        .should("contain", "16h00")
        .find("[aria-label='Remover lembrete']")
        .as("remover")
        .click();

      // O primeiro clique só pede confirmação
      cy.get("@remover").should("have.text", "Remover?");
      cy.get("#agn .agn-row").should("have.length", antes + 1);

      cy.contains("#agn .agn-row", "Revisar casos de teste").find(".agn-del").click();
      cy.get("#agn .agn-row").should("have.length", antes);
      cy.get("#agn").should("not.contain", "Revisar casos de teste");
    });
  });

  it("Ver registro completo abre o dia no Diário", () => {
    cy.get("#agn [data-goday]").invoke("attr", "data-goday").then((data) => {
      cy.get("#agn [data-goday]").click();
      cy.painelVisivel("diario");
      cy.get(`#d-${data} .day-head`).should("have.attr", "aria-expanded", "true");
    });
  });
});
