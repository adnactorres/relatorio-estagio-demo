describe("Cadastro de um dia", () => {
  beforeEach(() => {
    cy.abrirRelatorio();
    cy.get("#fabBtn").click().should("have.attr", "aria-expanded", "true");
    cy.get("[data-fab=dia]").click();
    cy.painelVisivel("cadastrar");
  });

  it("identifica cliente, squad e tipo pelo texto digitado", () => {
    cy.get("#f-txt").type("Validei a tarefa 3 da UFVS 15 no Squad Atlas.");
    cy.get("#f-detect")
      .should("contain", "UFVS · 15")
      .and("contain", "Squad Atlas")
      .and("contain", "Validação");
  });

  it("salva um dia novo e ele aparece no Diário", () => {
    cy.get("#f-d").invoke("val").then((data) => {
      cy.get(`#d-${data}`).should("not.exist");

      cy.get("#f-txt").type("Executei os cenários da tarefa 1 da UECV 5.");
      cy.get("#f-err").type("Botão de salvar fica ativo com campo obrigatório vazio.");
      cy.get("#saveBtn").click();
      cy.get("#saveStatus").should("have.text", "Dia salvo.");

      cy.abrirAba("Diário");
      cy.get("#count").should("have.text", "36 de 36 dias");
      cy.get(`#d-${data}`)
        .should("exist")
        .and("contain", "Executei os cenários da tarefa 1 da UECV 5.");
    });
  });

  it("carrega um dia já registrado para edição, sem duplicar", () => {
    cy.abrirAba("Diário");
    cy.get("#list article.day").first().invoke("attr", "id").then((id) => {
      const data = id.replace("d-", "");
      cy.get("#fabBtn").click();
      cy.get("[data-fab=dia]").click();
      cy.get("#f-d").clear().type(data).trigger("change");
      cy.get("#saveStatus").should("have.text", "Registro deste dia carregado para edição.");
      cy.get("#f-txt").should("contain", "Validei a tarefa 5 da UFVS 15");

      cy.get("#saveBtn").click();
      cy.abrirAba("Diário");
      cy.get("#count").should("have.text", "35 de 35 dias");
    });
  });

  it("não salva sem data", () => {
    cy.get("#f-d").clear();
    cy.get("#f-txt").type("Dia sem data.");
    cy.get("#saveBtn").click();
    cy.get("#f-d").then(($d) => expect($d[0].validity.valid).to.be.false);
    cy.get("#saveStatus").should("not.have.text", "Dia salvo.");
  });

  it("nada fica salvo depois de recarregar a demo", () => {
    cy.get("#f-txt").type("Registro temporário.");
    cy.get("#saveBtn").click();
    cy.get("#saveStatus").should("have.text", "Dia salvo.");
    cy.reload();
    cy.abrirAba("Diário");
    cy.get("#count").should("have.text", "35 de 35 dias");
  });
});
