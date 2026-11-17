describe("Bit, o agente do relatório", () => {
  beforeEach(() => cy.abrirRelatorio());

  it("abre o chat ao clicar no Bit e fecha com Esc", () => {
    cy.get("#bitChat").should("not.be.visible");
    cy.get("#mascotBtn").click();
    cy.get("#bitChat").should("be.visible").and("have.attr", "role", "dialog");
    cy.get("#bcTxt").should("be.focused");
    cy.get("body").type("{esc}");
    cy.get("#bitChat").should("not.be.visible");
  });

  it("responde com os números do relatório", () => {
    cy.get("#mascotBtn").click();
    cy.get("#bcTxt").type("Quantos dias eu registrei?{enter}");
    cy.get("#bitChat")
      .should("contain", "São 35 dias registrados")
      .and("contain", "Resposta simulada");
  });

  it("os testes do Bit na página de bastidores passam", () => {
    cy.abrirBastidores("O Bit");
    cy.get("#tMode").should("contain", "Bit simulado");
    cy.get("#tRun").click();
    cy.get("#tRun", { timeout: 30000 }).should("have.text", "Rodar de novo").and("not.be.disabled");
    cy.get("#tSum").invoke("text").then((t) => {
      const [, passaram, total] = t.match(/(\d+) de (\d+)/);
      expect(Number(total)).to.be.greaterThan(0);
      expect(passaram, "testes que passaram").to.eq(total);
    });
  });
});
