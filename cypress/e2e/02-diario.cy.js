describe("Diário", () => {
  beforeEach(() => {
    cy.abrirRelatorio();
    cy.abrirAba("Diário");
  });

  it("lista todos os dias registrados", () => {
    cy.get("#count").should("have.text", "35 de 35 dias");
    cy.get("#list article.day").should("have.length", 35);
  });

  it("os dias aparecem do mais recente para o mais antigo", () => {
    cy.get("#list article.day").then(($dias) => {
      const datas = [...$dias].map((d) => d.id.replace("d-", ""));
      expect(datas).to.deep.equal([...datas].sort().reverse());
    });
  });

  it("a busca filtra pelo texto e mostra aviso quando nada corresponde", () => {
    cy.get("#q").type("cenários");
    cy.contadorDiario().then(({ mostrados, total }) => {
      expect(mostrados).to.be.greaterThan(0).and.lessThan(total);
    });
    cy.get("#list article.day:visible").each(($dia) => {
      expect($dia.text().toLowerCase()).to.contain("cenários");
    });

    cy.get("#q").clear().type("texto que não existe");
    cy.get("#count").should("have.text", "0 de 35 dias");
    cy.get("#list").should("contain", "Nenhum dia corresponde aos filtros.");
  });

  it("filtra por tipo de atividade com os chips", () => {
    cy.get('#chips .chip[data-t="M"]').as("chip").should("have.attr", "aria-pressed", "false").click();
    cy.get("@chip").should("have.attr", "aria-pressed", "true");
    cy.get("#count").should("have.text", "7 de 35 dias");
    cy.get("#list article.day:visible").each(($dia) => {
      cy.wrap($dia).find(".tag.t-M").should("exist");
    });
  });

  it("filtra por time e por cliente", () => {
    cy.get("#fPhase").select("Implantação");
    cy.get("#count").should("have.text", "8 de 35 dias");

    cy.get("#fPhase").select("Todos os times");
    cy.get("#fOs").select("UFVS");
    cy.get("#count").should("have.text", "12 de 35 dias");
    cy.get("#list article.day:visible .os").should("contain", "UFVS");
  });

  it("Limpar desfaz todos os filtros de uma vez", () => {
    cy.get("#q").type("UFVS");
    cy.get('#chips .chip[data-t="V"]').click();
    cy.get("#fPhase").select("Customização");
    cy.get("#count").invoke("text").should("not.eq", "35 de 35 dias");

    cy.get("#clear").click();
    cy.get("#q").should("have.value", "");
    cy.get("#fPhase").should("have.value", "");
    cy.get('#chips .chip[aria-pressed="true"]').should("not.exist");
    cy.get("#count").should("have.text", "35 de 35 dias");
  });

  it("abre um dia e depois expande e recolhe todos", () => {
    cy.get("#list article.day").first().as("dia");
    cy.get("@dia").find(".day-body").should("not.be.visible");
    cy.get("@dia").find(".day-head").click();
    cy.get("@dia").find(".day-head").should("have.attr", "aria-expanded", "true");
    cy.get("@dia").find(".day-body").should("be.visible").and("contain", "Atividades realizadas");

    cy.get("#expAll").click().should("have.text", "Recolher tudo");
    cy.get("#list .day-body:visible").should("have.length", 35);
    cy.get("#expAll").click();
    cy.get("#list .day-body:visible").should("have.length", 0);
  });

  it("troca para o calendário e volta para a lista", () => {
    cy.get("#dvBtnCal").click().should("have.attr", "aria-pressed", "true");
    cy.get("#dvCal").should("be.visible");
    cy.get("#dvLista").should("not.be.visible");
    cy.get("#calNav").should("contain", "dias registrados");
    cy.get("#cal button[data-d]").should("have.length.greaterThan", 0);

    cy.get("#dvBtnLista").click().should("have.attr", "aria-pressed", "true");
    cy.get("#dvLista").should("be.visible");
  });
});
