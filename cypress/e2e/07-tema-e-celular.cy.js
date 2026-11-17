describe("Tema escuro", () => {
  beforeEach(() => cy.abrirRelatorio());

  it("alterna entre claro e escuro", () => {
    cy.get("html").should("not.have.attr", "data-theme", "dark");
    cy.get("#themeBtn").should("contain", "Tema escuro").click();
    cy.get("html").should("have.attr", "data-theme", "dark");
    cy.get("#themeBtn").should("contain", "Tema claro").click();
    cy.get("html").should("not.have.attr", "data-theme", "dark");
  });

  it("lembra o tema escolhido ao recarregar", () => {
    cy.get("#themeBtn").click();
    cy.reload();
    cy.get("html").should("have.attr", "data-theme", "dark");
  });
});

describe("No celular", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.abrirRelatorio();
  });

  it("não cria rolagem horizontal em nenhuma aba", () => {
    ["Agenda", "Diário", "Indicadores", "Clientes", "Dados do estágio", "Acadêmico"].forEach((aba) => {
      cy.abrirAba(aba);
      cy.document().then((doc) => {
        expect(doc.documentElement.scrollWidth, `largura na aba ${aba}`).to.be.at.most(
          doc.documentElement.clientWidth
        );
      });
    });
  });

  it("o chat do Bit cabe na tela", () => {
    cy.get("#mascotBtn").click();
    cy.get("#bitChat").should("be.visible").then(($c) => {
      const r = $c[0].getBoundingClientRect();
      const largura = $c[0].ownerDocument.documentElement.clientWidth;
      expect(r.left).to.be.at.least(0);
      expect(r.right).to.be.at.most(largura);
    });
  });
});
